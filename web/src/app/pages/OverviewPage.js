import { useState } from 'react';
import './OverviewPage.css';
import NewDepositModal from '../features/NewDepositModal';
import { mintableTokenABI, usdcContract } from '../lib/contracts';
import { chain } from '../lib/chain';
import { parseEther } from 'viem';
import { useWriteContract, useAccount } from 'wagmi';
import { useUserState } from '../providers/UserStateProvider';

const outstandingLoans = [
  {
    name: 'Mortgage Loan',
    details: '$150,000 – 30 years',
    due: '$1,200 due',
    interest: '6.2%',
    paymentsRemaining: 24,
  },
  {
    name: 'Auto Loan',
    details: '$30,000 – 5 years',
    due: '$350 due',
    interest: '7.1%',
    paymentsRemaining: 8,
  },
];

const OverviewPage = () => {
  const [depositOpen, setDepositOpen] = useState(false);
  const { writeContract } = useWriteContract();
  const { address } = useAccount();
  const { balances, isLoading, updateBalances } = useUserState();

  const closeModal = () => {
    setDepositOpen(false);
    updateBalances();
  };

  const mintUSDC = async () => {
    const amount = 100000
    const amountBig = parseEther(amount.toString())

    const tx = {
      address: usdcContract.addresses[chain.id],
      abi: mintableTokenABI,
      functionName: 'mint',
      args: [ amountBig, address ]
    }

    try {
      writeContract(tx);

      setTimeout(() => updateBalances(), 2000);
    } catch (err) {
      alert(err);
      return err;
    }
  }

  return (
    <div className="overview-content">
      <div className="overview-header-row">
        <h2 className="loan-title">Account Overview</h2>
        <button className="btn mint-test-usdc-link" onClick={mintUSDC}>Mint 100,000 Test USDC</button>
      </div>
      <div className="overview-cards">
        <div className="overview-card">
          <div className="overview-card-title">Total Balance</div>
          <div className="overview-balance">
            {isLoading ? '...' : `$${balances.bank.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          </div>
          <div className="overview-label">BANK</div>
          <button className="btn btn-blue-filled overview-deposit-btn" onClick={() => setDepositOpen(true)}>Deposit</button>
        </div>
        <div className="overview-card">
          <div className="overview-card-title">Staked</div>
          <div className="overview-balance">
            {isLoading ? '...' : `$${balances.sBank.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          </div>
          <div className="overview-label">sBANK</div>
          <button className="btn btn-blue-filled overview-stake-btn">Stake</button>
        </div>
        <div className="overview-card">
          <div className="overview-card-title">Loans Owned</div>
          <div className="overview-balance">$7,500.00</div>
          <div className="overview-label">3 active loans</div>
          <button className="btn btn-blue-filled overview-new-loan-btn">New Loan Application</button>
        </div>
      </div>
      <NewDepositModal open={depositOpen} onClose={() => closeModal()} onSubmit={closeModal} />
      <div className="overview-section">
        <div className="overview-section-title">Outstanding Loans</div>
        <div className="overview-loans-table-card">
          <table className="overview-loans-table">
            <thead>
              <tr>
                <th>Loan</th>
                <th>Interest Rate</th>
                <th>Payments Remaining</th>
                <th>Amount Due</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {outstandingLoans.map((loan, idx) => (
                <tr key={loan.name}>
                  <td>
                    <span className="overview-loan-name">{loan.name}</span>
                    <span className="overview-loan-details">{loan.details}</span>
                  </td>
                  <td>{loan.interest}</td>
                  <td>{loan.paymentsRemaining}</td>
                  <td>{loan.due}</td>
                  <td className="overview-loan-actions">
                    <button className="btn btn-blue-filled overview-pay-btn">Make Payment</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="overview-section">
        <div className="overview-section-title">Earnings from Purchased Loans</div>
        <ul className="overview-earnings-list">
          <li>
            <div>
              <span className="overview-loan-name">Small Business Loan</span>
              <span className="overview-loan-details">$80,000 – 5 years</span>
            </div>
            <div className="overview-earnings">
              <span className="overview-earnings-amount">$320 earned</span>
              <span className="overview-payment-history">
                <svg className="checkmark" width="18" height="18" viewBox="0 0 20 20"><circle cx="10" cy="10" r="9" fill="#eafaf1"/><path d="M6 10.5l3 3 5-5" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                <svg className="checkmark" width="18" height="18" viewBox="0 0 20 20"><circle cx="10" cy="10" r="9" fill="#eafaf1"/><path d="M6 10.5l3 3 5-5" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                <svg className="xmark" width="18" height="18" viewBox="0 0 20 20"><circle cx="10" cy="10" r="9" fill="#fbeaea"/><path d="M7 7l6 6M13 7l-6 6" stroke="#ef4444" strokeWidth="2" strokeLinecap="round"/></svg>
              </span>
              <button className="btn btn-green-filled loan-buy-btn">Buy</button>
              <button className="btn btn-red-outline loan-sell-btn">Sell</button>
            </div>
          </li>
          <li>
            <div>
              <span className="overview-loan-name">Mortgage Loan</span>
              <span className="overview-loan-details">$200,000 – 15 years</span>
            </div>
            <div className="overview-earnings">
              <span className="overview-earnings-amount">$1,100 earned</span>
              <span className="overview-payment-history">
                <svg className="checkmark" width="18" height="18" viewBox="0 0 20 20"><circle cx="10" cy="10" r="9" fill="#eafaf1"/><path d="M6 10.5l3 3 5-5" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                <svg className="checkmark" width="18" height="18" viewBox="0 0 20 20"><circle cx="10" cy="10" r="9" fill="#eafaf1"/><path d="M6 10.5l3 3 5-5" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                <svg className="checkmark" width="18" height="18" viewBox="0 0 20 20"><circle cx="10" cy="10" r="9" fill="#eafaf1"/><path d="M6 10.5l3 3 5-5" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </span>
              <button className="btn btn-green-filled loan-buy-btn">Buy</button>
              <button className="btn btn-red-outline loan-sell-btn">Sell</button>
            </div>
          </li>
        </ul>
      </div>
      <div className="overview-activity">
        <div className="overview-activity-title">Recent Activity</div>
        <ul className="overview-activity-list">
          <li>Deposited $2,000 USDC <span className="overview-activity-date">2 days ago</span></li>
          <li>Staked $1,000 USDC <span className="overview-activity-date">3 days ago</span></li>
          <li>Bought $2,500 Mortgage Loan <span className="overview-activity-date">5 days ago</span></li>
          <li>Received $75 interest <span className="overview-activity-date">1 week ago</span></li>
        </ul>
      </div>
    </div>
  );
};

export default OverviewPage; 