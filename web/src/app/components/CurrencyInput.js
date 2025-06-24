import React from 'react';
import { formatCurrency } from '../lib/currency';

/**
 * Reusable currency input component with automatic formatting
 * @param {Object} props
 * @param {string} props.value - Current formatted value
 * @param {Function} props.onChange - Change handler receiving formatted value
 * @param {string} props.placeholder - Input placeholder
 * @param {string} props.label - Input label
 * @param {string} props.helperText - Helper text below input
 * @param {string} props.id - Input ID
 * @param {string} props.className - Additional CSS classes
 * @param {boolean} props.required - Whether input is required
 * @param {number} props.maxLength - Maximum character length
 */
const CurrencyInput = ({ 
  value, 
  onChange, 
  placeholder = "$0.00",
  label,
  availableBalance,
  helperText,
  id,
  className = "",
  required = false,
  maxLength = 16,
  ...props 
}) => {
  const handleChange = (e) => {
    const raw = e.target.value;
    const formatted = formatCurrency(raw);
    onChange(formatted);
  };

  const makeLabel = () => {
    if(!label){ return ""}

    const balanceAsCurrency = availableBalance ? availableBalance > 1000 ? formatCurrency(availableBalance.toString()).replace("$","") : availableBalance.toFixed(2) : '';
    const balanceTxt = availableBalance ? `(${balanceAsCurrency} available)` : '';
  
    return `${label} ${balanceTxt}`;
  }

  return (
    <div className="currency-input-container">
      {label && (
        <label className="modal-label" htmlFor={id}>
          {makeLabel()} 
        </label>
      )}
      <input
        id={id}
        type="text"
        className={`loan-input modal-input ${className}`}
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        inputMode="decimal"
        autoComplete="off"
        maxLength={maxLength}
        required={required}
        {...props}
      />
      {helperText && (
        <div className="modal-helper-text">{helperText}</div>
      )}
    </div>
  );
};

export default CurrencyInput;
