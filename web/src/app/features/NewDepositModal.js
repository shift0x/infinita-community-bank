import React, { useState, useEffect } from 'react';
import './NewDepositModal.css';

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

  const handleSubmit = (e) => {
    e.preventDefault();
    const numericValue = parseCurrency(amount);
    if (numericValue && !isNaN(Number(numericValue))) {
      onSubmit(numericValue);
      setAmount('');
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose} aria-label="Close">&times;</button>
        <h2 className="modal-title">Deposit Funds</h2>
        <div className="modal-info-text">
          Your deposit will be used by Infinita Bank to make community loans. Withdrawals may be delayed if funds are currently in use for active loans.
        </div>
        <form onSubmit={handleSubmit} className="modal-form">
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
          <button type="submit" className="btn btn-blue-filled modal-submit-btn">Deposit</button>
        </form>
      </div>
    </div>
  );
};

export default NewDepositModal; 