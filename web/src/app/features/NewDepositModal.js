import React, { useState, useEffect } from 'react';
import { useAccount, useWriteContract, useChainId, useSwitchChain, useReadContract } from 'wagmi';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { bankContract, usdcContract } from '../lib/contracts'
import './NewDepositModal.css';
import { erc20Abi, formatEther, parseEther } from 'viem';
import { chain, config } from '../lib/chain';
import { readContract } from 'viem/actions';


function formatCurrency(value) {
  // Remove all non-numeric except dot
  let cleaned = value.replace(/[^\d.]/g, '');
  // Only allow one dot
  const parts = cleaned.split('.');
  if (parts.length > 2) cleaned = parts[0] + '.' + parts[1];
  // Format as currency
  let [intPart, decPart] = cleaned.split('.');
  intPart = intPart ? String(Number(intPart)) : '';
  // Add commas to integer part
  if (intPart) intPart = Number(intPart).toLocaleString();
  if (decPart !== undefined) decPart = decPart.slice(0, 2);
  let formatted = intPart;
  if (decPart !== undefined) formatted += '.' + decPart;
  if (formatted) formatted = '$' + formatted;
  return formatted;
}

function parseCurrency(formatted) {
  return formatted.replace(/[^\d.]/g, '');
}

const NewDepositModal = ({ open, onClose, onSubmit }) => {
  const [amount, setAmount] = useState('');
  const { address, isConnected } = useAccount();
  const { openConnectModal } = useConnectModal();
  const { writeContractAsync } = useWriteContract();
  const { switchChainAsync } = useSwitchChain();

  const chainId = useChainId();

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

  const handleChange = (e) => {
    const raw = e.target.value;
    setAmount(formatCurrency(raw));
  };

  const ensureConnectedToTargetChain = async () => {
    if(chainId == chain.id){ return; }

    try {
      await switchChainAsync({ chainId: chain.id });
    } catch (err) {
      console.error('chain switch failed:', err);
      
      return;
    }
  }

  const ensureUSDCTokenApproval = async(spender, amount) => {

    const client = config.getClient()
    
    const response = await readContract(client, {
      address: usdcContract.addresses[chain.id],
      abi: erc20Abi,
      functionName: 'allowance',
      args: [address, spender], 
    });

    const allowance = Number(formatEther(response));

    if(allowance > amount){ return; }

    const desiredAllowanceBig = parseEther(amount);

    const tx = {
      address: usdcContract.addresses[chain.id],
      abi: erc20Abi,
      functionName: 'approve',
      args: [spender, desiredAllowanceBig]
    }

    try {
      await writeContractAsync(tx);
    } catch (err) {
      return err;
    }
  }

  const submitDeposit = async (e) => {
    e.preventDefault();

    const currencyAmount = parseCurrency(amount);
    const currencyAmountBig = parseEther(currencyAmount.toString());

    await ensureConnectedToTargetChain()

    const err = await ensureUSDCTokenApproval(bankContract.addresses[chain.id], currencyAmount)

    if(err != null){ 
      alert(err);

      return; 
    }

    const tx = {
      abi : bankContract.abi,
      address : bankContract.addresses[chain.id],
      functionName: "deposit",
      args: [ currencyAmountBig ]
    }

    try {
      await writeContractAsync(tx);

      setAmount('');
      onSubmit();
    } catch(err){
      alert(err);
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose} aria-label="Close">&times;</button>
        <h2 className="modal-title">Deposit Funds</h2>
        <div className="modal-info-text">
          Your deposit will be used by Infinita Bank to make community loans. Withdrawals may be delayed if funds are currently in use for active loans.
        </div>
        <form onSubmit={submitDeposit} className="modal-form">
          <label className="modal-label" htmlFor="deposit-amount">Amount</label>
          <input
            id="deposit-amount"
            type="text"
            className="loan-input modal-input"
            placeholder="$0.00"
            value={amount}
            onChange={handleChange}
            inputMode="decimal"
            autoComplete="off"
            maxLength={16}
            required
          />
          <div className="modal-helper-text">Enter the amount you wish to deposit (USDC)</div>

          { 
            isConnected ?
              <button type="submit" className="btn btn-blue-filled modal-submit-btn">Deposit</button> : ''
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

export default NewDepositModal; 