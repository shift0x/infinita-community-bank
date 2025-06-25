import React, { useState, useEffect } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { parseCurrency } from '../lib/currency';
import CurrencyInput from '../components/CurrencyInput';
import './NewDepositModal.css'; // Reusing the same styles
import './LoanRequestModal.css'; // Additional styles for loan-specific fields
import { lendingVaultABI, lendingVaultContract, tokens } from '../lib/contracts';
import { chain } from '../lib/chain';
import { parseEther, parseUnits } from 'viem';
import { ensureTokenApproval, getUserTokenBalance } from '../lib/tokenUtils';
import { useUserState } from '../providers/UserStateProvider';

const LoanRequestModal = ({ open, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    amount: '',
    collateral: '',
    term: '',
    details: '',
    purpose: 'personal'
  });
  const { address, isConnected } = useAccount();
  const { openConnectModal } = useConnectModal();
  const { writeContractAsync } = useWriteContract();
  const { balances, updateBalances } = useUserState();

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  if (!open) return null;

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    const loanAmount = parseCurrency(formData.amount);
    const collateralAmount = parseCurrency(formData.collateral);
    
    if (!loanAmount || Number(loanAmount) <= 0) {
      alert('Please enter a valid loan amount');
      return;
    }

    if(collateralAmount < loanAmount*.10){
      alert('Collateral amount must be at least 10% of loan amount');
      return;
    }

    if(collateralAmount > balances.usdc){
      alert('insufficent user funds for collateral amount');
      return
    }
    
    if (!formData.term || Number(formData.term) <= 0) {
      alert('Please enter a valid loan term');
      return;
    }
    
    if (!formData.details.trim()) {
      alert('Please provide loan details');
      return;
    }

    const usdc = tokens[chain.id].USDC
    const vault = lendingVaultContract.addresses[chain.id]

    const loanValueUSDCBalance = await getUserTokenBalance({token: usdc, owner: vault});

    if(loanValueUSDCBalance < loanAmount){
      alert('Loan vault does not have enough funds to fund loan request');
      return;
    }

    const loanRequest = {
      amount: loanAmount,
      collateral: collateralAmount,
      term: Number(formData.term),
      details: formData.details.trim(),
      purpose: formData.purpose
    };

    await createLoanRequest(loanRequest);

    // Reset form
    setFormData({
      amount: '',
      collateral: '',
      term: '',
      details: '',
      purpose: 'personal'
    });
  };

  const createLoanRequest = async(loanInfo) => {
    // Ensure USDC token approval so collateral can be transferred to loanVault
    const err = await ensureTokenApproval({
      tokenAddress: tokens[chain.id].USDC,
      ownerAddress: address,
      spenderAddress: lendingVaultContract.addresses[chain.id], 
      amount: loanInfo.collateral,
      writeContractAsync
    });

    if (err != null) { 
      alert(err);
      return; 
    }

    const tx = {
      abi: lendingVaultContract.abi,
      address: lendingVaultContract.addresses[chain.id],
      functionName: "submitLoanRequest",
      args: [
        parseEther(loanInfo.amount.toString()),
        parseEther(loanInfo.collateral.toString()),
        parseUnits(loanInfo.term.toString(), 0),
        JSON.stringify(loanInfo)
      ]
    };

    try {
      await writeContractAsync(tx);

      setTimeout(() => { updateBalances(); }, 5000);

      onSubmit();
    } catch (err) {
      alert(err);
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box loan-request-modal" onClick={e => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose} aria-label="Close">&times;</button>
        <h2 className="modal-title">Submit Loan Request</h2>
        <div className="modal-info-text">
          Complete the form below to submit your loan application. Our loan officers will review your request and provide terms if approved.
        </div>
        
        <form onSubmit={handleSubmit} className="modal-form">
          <CurrencyInput
            id="loan-amount"
            label="Loan Amount"
            value={formData.amount}
            onChange={(value) => handleInputChange('amount', value)}
            helperText="Enter the amount you wish to borrow (USDC)"
            required
          />

          <CurrencyInput
            id="collateral-amount"
            label="Collateral Amount (Min. 10% of loan amount)"
            value={formData.collateral}
            availableBalance={balances.usdc}
            onChange={(value) => handleInputChange('collateral', value)}
            helperText="Enter collateral amount to secure the loan (USDC)"
          />

          <div className="currency-input-container">
            <label className="modal-label" htmlFor="loan-purpose">
              Loan Purpose
            </label>
            <select
              id="loan-purpose"
              className="modal-input modal-select"
              value={formData.purpose}
              onChange={(e) => handleInputChange('purpose', e.target.value)}
              required
            >
              <option value="personal">Personal</option>
              <option value="business">Business</option>
              <option value="education">Education</option>
              <option value="home">Home Improvement</option>
              <option value="auto">Auto</option>
              <option value="medical">Medical</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="currency-input-container">
            <label className="modal-label" htmlFor="loan-term">
              Loan Term
            </label>
            <input
              id="loan-term"
              type="number"
              className="modal-input"
              placeholder="12"
              value={formData.term}
              onChange={(e) => handleInputChange('term', e.target.value)}
              min="1"
              max="360"
              required
            />
            <div className="modal-helper-text">Enter loan term in months (1-360)</div>
          </div>

          <div className="currency-input-container">
            <label className="modal-label" htmlFor="loan-details">
              Loan Details (Include how the loan would help develop Infinita)
            </label>
            <textarea
              id="loan-details"
              className="modal-input modal-textarea"
              placeholder="Describe the purpose of your loan, how you plan to use the funds, and any additional information that would help with your application..."
              value={formData.details}
              onChange={(e) => handleInputChange('details', e.target.value)}
              rows={4}
              maxLength={500}
              required
            />
            <div className="modal-helper-text">
              Provide details about your loan request ({formData.details.length}/500 characters)
            </div>
          </div>

          { 
            isConnected ?
              <button type="submit" className="btn btn-blue-filled modal-submit-btn">Submit Loan Request</button> : ''
          }
          
        </form>

        {
          !isConnected ?
            <button className="btn btn-blue-outline modal-submit-btn" onClick={openConnectModal}>Connect Wallet</button> : ''
        }
      </div>
    </div>
  );
};

export default LoanRequestModal;
