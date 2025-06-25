import React, { useState, useEffect } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import { parseCurrency, formatCurrency } from '../lib/currency';
import CurrencyInput from '../components/CurrencyInput';
import './NewDepositModal.css'; // Reusing the same styles
import './LoanPaymentModal.css'; // Additional styles for loan payment modal
import { lendingVaultContract, tokens } from '../lib/contracts';
import { chain } from '../lib/chain';
import { useUserState } from '../providers/UserStateProvider';
import { ensureTokenApproval } from '../lib/tokenUtils';
import { parseEther } from 'viem';

const LoanPaymentModal = ({ open, onClose, onSubmit, loan }) => {
  const [paymentAmount, setPaymentAmount] = useState('');
  const { address } = useAccount();
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

  if (!open || !loan) return null;

  const handleAmountChange = (formattedValue) => {
    setPaymentAmount(formattedValue);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const amount = parseCurrency(paymentAmount);
    
    if (!amount || Number(amount) <= 0) {
      alert('Please enter a valid payment amount');
      return;
    }

    const amountNumber = Number(amount);
    const remainingBalance = Number(loan.remainingBalance);
    
    if (amountNumber > remainingBalance) {
      alert('Payment amount cannot exceed remaining balance');
      return;
    }

    if(amountNumber > balances.usdc) {
      alert('Insufficent user balances for payment amount');
      return;
    }

    await submitLoanPayment(amountNumber);

    // Reset form
    setPaymentAmount('');

    onSubmit();
  };

  const submitLoanPayment = async(amount) => {
    // Ensure USDC token approval so collateral can be transferred to loanVault
    const err = await ensureTokenApproval({
      tokenAddress: tokens[chain.id].USDC,
      ownerAddress: address,
      spenderAddress: lendingVaultContract.addresses[chain.id], 
      amount: amount,
      writeContractAsync
    });

    if (err != null) { 
      alert(err);
      return; 
    }

    const tx = {
      abi: lendingVaultContract.abi,
      address: lendingVaultContract.addresses[chain.id],
      functionName: "makeLoanPayment",
      args: [
        loan.id,
        parseEther(amount.toString())
      ]
    };

    try {
      await writeContractAsync(tx);

      setTimeout(() => { updateBalances(); }, 2000);

      onSubmit();
    } catch (err) {
      alert(err);
    }
  }

  const remainingBalance = Number(loan.remainingBalance || 0);
  const paidAmount = Number(loan.originalBalance || 0) - remainingBalance;
  const progressPercentage = loan.originalBalance ? (paidAmount / Number(loan.originalBalance)) * 100 : 0;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose} aria-label="Close">&times;</button>
        <h2 className="modal-title">Make Loan Payment</h2>
        
        <div className="loan-details-card">
          <div className="loan-detail-row">
            <span className="loan-detail-label">Loan Type:</span>
            <span className="loan-detail-value">{loan.details?.purpose || 'Unknown'} Loan</span>
          </div>
          <div className="loan-detail-row">
            <span className="loan-detail-label">Original Amount:</span>
            <span className="loan-detail-value">{formatCurrency(loan.amount?.toString() || '0')}</span>
          </div>
          <div className="loan-detail-row">
            <span className="loan-detail-label">Interest Rate:</span>
            <span className="loan-detail-value">{((loan.interestRate || 0) * 100).toFixed(2)}%</span>
          </div>
          <div className="loan-detail-row">
            <span className="loan-detail-label">Remaining Balance:</span>
            <span className="loan-detail-value loan-balance-highlight">
              {formatCurrency(remainingBalance.toString())}
            </span>
          </div>
          <div className="loan-detail-row">
            <span className="loan-detail-label">Progress:</span>
            <div className="loan-progress-container">
              <div className="loan-progress-bar">
                <div 
                  className="loan-progress-fill" 
                  style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                ></div>
              </div>
              <span className="loan-progress-text">{progressPercentage.toFixed(1)}% paid</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <CurrencyInput
            id="payment-amount"
            label="Payment Amount"
            value={paymentAmount}
            onChange={handleAmountChange}
            helperText={`Enter payment amount (Max: ${formatCurrency(remainingBalance.toString())})`}
            required
          />

           <button type="submit" className="btn btn-blue-filled modal-submit-btn">Submit Payment</button> 
        </form>
      </div>
    </div>
  );
};

export default LoanPaymentModal;
