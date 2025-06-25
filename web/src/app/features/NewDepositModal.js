import { useState, useEffect } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { bankContract, usdcContract } from '../lib/contracts'
import { parseCurrency } from '../lib/currency';
import { ensureTokenApproval } from '../lib/tokenUtils';
import CurrencyInput from '../components/CurrencyInput';
import './NewDepositModal.css';
import { parseEther } from 'viem';
import { chain } from '../lib/chain';
import { useUserState } from '../providers/UserStateProvider';

const NewDepositModal = ({ open, onClose, onSubmit }) => {
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

  

  const submitDeposit = async (e) => {
    e.preventDefault();

    const currencyAmount = parseCurrency(amount);
    const currencyAmountBig = parseEther(currencyAmount.toString());

    const err = await ensureTokenApproval({
      tokenAddress: usdcContract.addresses[chain.id],
      ownerAddress: address,
      spenderAddress: bankContract.addresses[chain.id],
      amount: currencyAmount,
      writeContractAsync
    })

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

      setTimeout(() => { updateBalances(); }, 5000);

      setAmount('');
      onSubmit();
    } catch(err){
      console.log(err);
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
          <CurrencyInput
            id="deposit-amount"
            label='Amount'
            availableBalance={balances.usdc}
            value={amount}
            onChange={handleAmountChange}
            helperText="Enter the amount you wish to deposit (USDC)"
            required
          />

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