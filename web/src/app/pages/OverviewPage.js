import { useEffect, useState } from 'react';
import './OverviewPage.css';
import NewDepositModal from '../features/NewDepositModal';
import StakeModal from '../features/StakeModal';
import LoanRequestModal from '../features/LoanRequestModal';
import { mintableTokenABI, usdcContract } from '../lib/contracts';
import { chain } from '../lib/chain';
import { parseEther } from 'viem';
import { useWriteContract, useAccount } from 'wagmi';
import { useUserState } from '../providers/UserStateProvider';
import { formatCurrency } from '../lib/currency';


const OverviewPage = () => {
  const [depositOpen, setDepositOpen] = useState(false);
  const [stakeOpen, setStakeOpen] = useState(false);
  const [loanRequestOpen, setLoanRequestOpen] = useState(false);
  const [outstandingLoans, setOutstandingLoans] = useState([]);
  const { writeContract } = useWriteContract();
  const { address } = useAccount();
  const { userLoans, userLoanAmountOwed, balances, isLoading, updateBalances } = useUserState();

  const closeModal = () => {
    setDepositOpen(false);
  };

  const closeStakeModal = () => {
    setStakeOpen(false);
  };

  const closeLoanRequestModal = () => {
    setLoanRequestOpen(false);
  };

  const handleLoanSubmit = (loanRequest) => {
    console.log('Loan request submitted:', loanRequest);
    // TODO: Handle loan submission logic here
    closeLoanRequestModal();
  };

  useEffect(() => {
    const openLoans = userLoans.filter(loan => { return loan.status == "Open"});

    setOutstandingLoans(openLoans);
  }, [userLoans])

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
        {
          balances.usdc == 0 ?
            <button className="btn mint-test-usdc-link" onClick={mintUSDC}>Mint 100,000 Test USDC</button> :
            <button className="btn mint-test-usdc-link">{formatCurrency(balances.usdc.toString())} Test USDC</button>
        }
        
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
          <button className="btn btn-blue-filled overview-stake-btn" onClick={() => setStakeOpen(true)}>Stake</button>
        </div>
        <div className="overview-card">
          <div className="overview-card-title">Loans Owned</div>
          <div className="overview-balance">{formatCurrency(userLoanAmountOwed.toString())}</div>
          <div className="overview-label">{userLoans.length} active loans</div>
          <button className="btn btn-blue-filled overview-new-loan-btn" onClick={() => setLoanRequestOpen(true)}>New Loan Application</button>
        </div>
      </div>
      <NewDepositModal open={depositOpen} onClose={() => closeModal()} onSubmit={closeModal} />
      <StakeModal open={stakeOpen} onClose={() => closeStakeModal()} onSubmit={closeStakeModal} />
      <LoanRequestModal open={loanRequestOpen} onClose={() => closeLoanRequestModal()} onSubmit={handleLoanSubmit} />
      <div className="overview-section">
        <div className="overview-section-title">Outstanding Loans</div>
        <div className="overview-loans-table-card">
          <table className="overview-loans-table">
            <thead>
              <tr>
                <th>Loan</th>
                <th>Interest Rate</th>
                <th>Collateral</th>
                <th>Amount Paid</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {outstandingLoans.map((loan, idx) => (
                <tr key={loan.id}>
                  <td>
                    <span className="overview-loan-name">{loan.details.purpose} Loan</span>
                    <span className="overview-loan-details">{formatCurrency(loan.amount.toString())} - {loan.term} Months</span>
                  </td>
                  <td>{loan.interestRate * 100}%</td>
                  <td>{formatCurrency(loan.collateral.toString())}</td>
                  <td>{formatCurrency((loan.originalBalance - loan.remainingBalance).toString())}</td>
                  <td className="overview-loan-actions">
                    <button className="btn btn-blue-filled overview-pay-btn">Make a Payment</button>
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