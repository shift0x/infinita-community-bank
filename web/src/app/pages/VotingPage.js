import React, { useState, useEffect } from 'react';
import './VotingPage.css';
import { useAccount } from 'wagmi';
import { formatCurrency } from '../lib/currency';

// Mock data for pending loan applications from the community
// In a real implementation, this would come from the smart contract
const mockPendingLoans = [
  {
    id: '0x1234567890abcdef',
    amount: 5000,
    term: 24,
    collateral: 2500,
    details: {
      purpose: 'Business',
      description: 'Expanding local coffee shop with new equipment and inventory'
    },
    applicant: '0xabc...def',
    status: 'Pending'
  },
  {
    id: '0x2345678901bcdefg',
    amount: 15000,
    term: 36,
    collateral: 0,
    details: {
      purpose: 'Education',
      description: 'Funding advanced engineering course to improve local infrastructure skills'
    },
    applicant: '0xbcd...efg',
    status: 'Pending'
  },
  {
    id: '0x3456789012cdefgh',
    amount: 8000,
    term: 18,
    collateral: 4000,
    details: {
      purpose: 'Medical',
      description: 'Establishing community health clinic with basic medical supplies'
    },
    applicant: '0xcde...fgh',
    status: 'Pending'
  },
  {
    id: '0x456789013defghi',
    amount: 25000,
    term: 48,
    collateral: 10000,
    details: {
      purpose: 'Home',
      description: 'Building sustainable housing unit using local materials and labor'
    },
    applicant: '0xdef...ghi',
    status: 'Pending'
  }
];

const VotingPage = () => {
  const { address, isConnected } = useAccount();
  const [pendingLoans, setPendingLoans] = useState([]);
  const [votedLoans, setVotedLoans] = useState(new Set());
  const [remainingVotes, setRemainingVotes] = useState(3);

  useEffect(() => {
    // In a real implementation, this would fetch all pending loans from the contract
    // For now, we use mock data to demonstrate the voting interface
    setPendingLoans(mockPendingLoans);
  }, []);

  const handleVote = (loanId) => {
    if (remainingVotes <= 0) {
      alert('You have used all your votes for this funding cycle.');
      return;
    }

    if (votedLoans.has(loanId)) {
      alert('You have already voted for this loan.');
      return;
    }

    // Add vote
    const newVotedLoans = new Set(votedLoans);
    newVotedLoans.add(loanId);
    setVotedLoans(newVotedLoans);
    setRemainingVotes(prev => prev - 1);

    console.log('Vote cast for loan:', loanId);
    // TODO: Submit vote to smart contract
  };

  const hasVoted = (loanId) => votedLoans.has(loanId);

  if (!isConnected) {
    return (
      <div className="voting-content">
        <div className="voting-header">
          <h2 className="loan-title">Community Loan Voting (Coming Soon...)</h2>
          <p className="loan-subtitle">Connect your wallet to participate in community loan decisions.</p>
        </div>
        <div className="voting-not-connected">
          <p>Please connect your wallet to access the voting system.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="voting-content">
      <div className="voting-header">
        <h2 className="loan-title">Community Loan Voting (Coming Soon...)</h2>
        <p className="loan-subtitle">
          Help decide which loans should receive funding from the community bank. 
          As an Infinita resident, you have <strong>{remainingVotes} votes</strong> remaining to support loan applications.
        </p>
        <div className="voting-info-card">
          <h3>How Community Voting Works</h3>
          <ul>
            <li><strong>Democratic Decision Making:</strong> Every verified Infinita resident gets 3 votes per funding cycle</li>
            <li><strong>Community First:</strong> Loans with the most community support are prioritized for funding</li>
            <li><strong>Transparent Process:</strong> All votes are recorded on-chain for complete transparency</li>
            <li><strong>Impact Focus:</strong> Consider how each loan will benefit the broader Infinita ecosystem</li>
          </ul>
        </div>
      </div>

      <div className="voting-stats">
        <div className="voting-stat-card">
          <div className="voting-stat-number">{pendingLoans.length}</div>
          <div className="voting-stat-label">Pending Loans</div>
        </div>
        <div className="voting-stat-card">
          <div className="voting-stat-number">{remainingVotes}</div>
          <div className="voting-stat-label">Votes Remaining</div>
        </div>
        <div className="voting-stat-card">
          <div className="voting-stat-number">{votedLoans.size}</div>
          <div className="voting-stat-label">Votes Cast</div>
        </div>
      </div>

      <div className="voting-section">
        <div className="voting-section-title">Pending Loan Applications</div>
        
        {pendingLoans.length === 0 ? (
          <div className="voting-empty-state">
            <p>No pending loan applications to vote on at this time.</p>
            <p>Check back later for new community funding opportunities.</p>
          </div>
        ) : (
          <div className="voting-table-card">
            <table className="voting-table">
              <thead>
                <tr>
                  <th>Loan Details</th>
                  <th>Amount Requested</th>
                  <th>Term</th>
                  <th>Collateral</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {pendingLoans.map((loan) => (
                  <tr key={loan.id} className={hasVoted(loan.id) ? 'voted-row' : ''}>
                    <td>
                      <div className="loan-details-cell">
                        <span className="voting-loan-purpose">
                          {loan.details?.purpose || 'General'} Loan
                        </span>
                        <span className="voting-loan-description">
                          {loan.details?.description || 'No description provided'}
                        </span>
                      </div>
                    </td>
                    <td className="voting-amount-cell">
                      {formatCurrency(loan.amount?.toString() || '0')}
                    </td>
                    <td>{loan.term || 0} months</td>
                    <td>
                      {loan.collateral && Number(loan.collateral) > 0 
                        ? formatCurrency(loan.collateral.toString())
                        : 'None'
                      }
                    </td>
                    <td className="voting-action-cell">
                      {hasVoted(loan.id) ? (
                        <div className="vote-status voted">
                          <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          Voted
                        </div>
                      ) : (
                        <button 
                          className={`btn voting-btn ${remainingVotes <= 0 ? 'btn-disabled' : 'btn-green-filled'}`}
                          onClick={() => handleVote(loan.id)}
                          disabled={remainingVotes <= 0}
                        >
                          Vote to Fund
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default VotingPage;
