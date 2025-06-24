import React, { useState, useEffect } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { bankContract, tokens } from '../lib/contracts'
import { parseCurrency } from '../lib/currency';
import { ensureTokenApproval } from '../lib/tokenUtils';
import CurrencyInput from '../components/CurrencyInput';
import './NewDepositModal.css'; // Reusing the same styles
import { parseEther } from 'viem';
import { chain } from '../lib/chain';
import { useUserState } from '../providers/UserStateProvider';

const StakeModal = ({ open, onClose, onSubmit }) => {
  const [amount, setAmount] = useState('');
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

  const handleAmountChange = (formattedValue) => {
    setAmount(formattedValue);
  };

  const submitStake = async (e) => {
    e.preventDefault();

    const currencyAmount = parseCurrency(amount);
    const currencyAmountBig = parseEther(currencyAmount.toString());

    // Check if user has enough BANK tokens
    const amountNumber = Number(currencyAmount);
    if (amountNumber > balances.bank) {
      alert('Insufficient BANK token balance');
      return;
    }


    // Ensure BANK token approval for staking
    const err = await ensureTokenApproval({
      tokenAddress: tokens[chain.id].BANK, // BANK token address
      ownerAddress: address,
      spenderAddress: bankContract.addresses[chain.id], // Bank contract for staking
      amount: currencyAmount,
      writeContractAsync
    });

    if (err != null) { 
      alert(err);
      return; 
    }

    const tx = {
      abi: bankContract.abi,
      address: bankContract.addresses[chain.id],
      functionName: "stake",
      args: [currencyAmountBig]
    };

    try {
      await writeContractAsync(tx);

      setTimeout(() => { updateBalances(); }, 2000);

      setAmount('');
      onSubmit();
    } catch (err) {
      alert(err);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose} aria-label="Close">&times;</button>
        <h2 className="modal-title">Stake BANK Tokens</h2>
        <div className="modal-info-text">
          Stake your BANK tokens and receive a share of bank profits. Your staked tokens will help support the community lending ecosystem.
        </div>
        <form onSubmit={submitStake} className="modal-form">
          <CurrencyInput
            id="stake-amount"
            label="Amount"
            value={amount}
            availableBalance={balances.bank}
            onChange={handleAmountChange}
            helperText={`Enter the amount you wish to stake`}
            required
          />

          { 
            isConnected ?
              <button type="submit" className="btn btn-blue-filled modal-submit-btn">Stake</button> : ''
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

export default StakeModal;
