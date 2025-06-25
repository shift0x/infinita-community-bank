import React, { useState, useEffect } from 'react';
import './TradePage.css';
import { useAccount } from 'wagmi';
import { formatCurrency } from '../lib/currency';

// Enhanced mock data for tradeable loan positions
const mockTradableLoans = [
  {
    id: '0x789abcdef0123456',
    loanType: 'Mortgage',
    originalAmount: 150000,
    term: 360, // months
    interestRate: 0.062,
    collateral: 180000,
    collateralType: 'Residential Property',
    location: 'Downtown Infinita',
    riskScore: 'Low',
    paymentsRemaining: 288,
    availableTokens: 12000,
    totalTokenSupply: 25000,
    currentYield: 6.2,
    totalReturns: 3840, // total earned so far
    liquidityPool: {
      price: 1.05, // current token price in USDC
      volume24h: 2500,
      liquidity: 15000
    },
    description: 'Single-family home in prime downtown location with stable rental income'
  },
  {
    id: '0x890bcdef01234567',
    loanType: 'Business',
    originalAmount: 80000,
    term: 60,
    interestRate: 0.081,
    collateral: 95000,
    collateralType: 'Commercial Equipment',
    location: 'Industrial District',
    riskScore: 'Medium',
    paymentsRemaining: 42,
    availableTokens: 4500,
    totalTokenSupply: 12000,
    currentYield: 8.1,
    totalReturns: 1620,
    liquidityPool: {
      price: 0.98,
      volume24h: 850,
      liquidity: 6500
    },
    description: 'Manufacturing equipment loan for established local textile business'
  },
  {
    id: '0x901cdef012345678',
    loanType: 'Mortgage',
    originalAmount: 200000,
    term: 180,
    interestRate: 0.057,
    collateral: 250000,
    collateralType: 'Commercial Property',
    location: 'Business Center',
    riskScore: 'Low',
    paymentsRemaining: 156,
    availableTokens: 20000,
    totalTokenSupply: 35000,
    currentYield: 5.7,
    totalReturns: 2280,
    liquidityPool: {
      price: 1.12,
      volume24h: 4200,
      liquidity: 28000
    },
    description: 'Office building with long-term commercial tenants and stable cash flow'
  },
  {
    id: '0xa12def0123456789',
    loanType: 'Education',
    originalAmount: 45000,
    term: 72,
    interestRate: 0.055,
    collateral: 0,
    collateralType: 'Future Earnings',
    location: 'University District',
    riskScore: 'Medium',
    paymentsRemaining: 68,
    availableTokens: 8500,
    totalTokenSupply: 15000,
    currentYield: 5.5,
    totalReturns: 495,
    liquidityPool: {
      price: 0.95,
      volume24h: 320,
      liquidity: 4500
    },
    description: 'Advanced medical training program for community healthcare worker'
  }
];

const TradePage = () => {
  const { address, isConnected } = useAccount();
  const [tradableLoans, setTradableLoans] = useState([]);
  const [selectedLoan, setSelectedLoan] = useState(null);

  useEffect(() => {
    // In a real implementation, this would fetch tradable loans from the contract
    setTradableLoans(mockTradableLoans);
  }, []);

  const handleBuy = (loan) => {
    console.log('Buy loan tokens:', loan.id);
    // TODO: Implement buy logic
  };

  const handleSell = (loan) => {
    console.log('Sell loan tokens:', loan.id);
    // TODO: Implement sell logic
  };

  const getRiskColor = (risk) => {
    switch (risk) {
      case 'Low': return '#10b981';
      case 'Medium': return '#f59e0b';
      case 'High': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const calculateProgress = (remaining, term) => {
    return ((term - remaining) / term) * 100;
  };

  if (!isConnected) {
    return (
      <div className="trade-content">
        <div className="trade-header">
          <h2 className="loan-title">Loan Token Trading</h2>
          <p className="loan-subtitle">Connect your wallet to access fractionalized loan investments.</p>
        </div>
        <div className="trade-not-connected">
          <p>Please connect your wallet to view and trade loan tokens.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="trade-content">
      <div className="trade-header">
        <h2 className="loan-title">Loan Token Trading (Coming Soon...)</h2>
        <p className="loan-subtitle">
          Invest in fractionalized community loans and earn consistent yield from debt payments. 
          Support local development while building your DeFi portfolio.
        </p>
        
        <div className="trade-info-card">
          <h3>How Loan Token Trading Works</h3>
          <div className="trade-info-grid">
            <div className="trade-info-item">
              <div className="trade-info-icon">💰</div>
              <div>
                <h4>Fractionalized Ownership</h4>
                <p>Buy tokens representing portions of real-world loans. Each token entitles you to a share of loan payments and potential profits.</p>
              </div>
            </div>
            <div className="trade-info-item">
              <div className="trade-info-icon">📈</div>
              <div>
                <h4>Consistent Yield</h4>
                <p>Earn regular returns from borrower payments. Yields are distributed automatically as loans are repaid over time.</p>
              </div>
            </div>
            <div className="trade-info-item">
              <div className="trade-info-icon">🔒</div>
              <div>
                <h4>Asset-Backed Security</h4>
                <p>Loans are secured by real-world collateral. If a loan defaults, the bank liquidates assets and distributes proceeds to token holders.</p>
              </div>
            </div>
            <div className="trade-info-item">
              <div className="trade-info-icon">🌊</div>
              <div>
                <h4>Liquidity Pools</h4>
                <p>Trade tokens anytime through UniswapV2 pools. Initial liquidity comes from loan collateral paired with tokens at origination.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="trade-stats">
        <div className="trade-stat-card">
          <div className="trade-stat-number">{tradableLoans.length}</div>
          <div className="trade-stat-label">Active Loans</div>
        </div>
        <div className="trade-stat-card">
          <div className="trade-stat-number">
            {formatCurrency(tradableLoans.reduce((sum, loan) => sum + loan.availableTokens, 0).toString())}
          </div>
          <div className="trade-stat-label">Available to Buy</div>
        </div>
        <div className="trade-stat-card">
          <div className="trade-stat-number">
            {(tradableLoans.reduce((sum, loan) => sum + loan.currentYield, 0) / tradableLoans.length).toFixed(1)}%
          </div>
          <div className="trade-stat-label">Average Yield</div>
        </div>
      </div>

      <div className="trade-section">
        <div className="trade-section-title">Available Loan Investments</div>
        
        <div className="trade-table-card">
          <table className="trade-table">
            <thead>
              <tr>
                <th>Loan Details</th>
                <th>Collateral & Risk</th>
                <th>Investment Info</th>
                <th>Market Data</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tradableLoans.map((loan) => (
                <tr key={loan.id}>
                  <td>
                    <div className="loan-details-cell">
                      <div className="loan-type-badge">{loan.loanType} Loan</div>
                      <div className="loan-amount">{formatCurrency(loan.originalAmount.toString())}</div>
                      <div className="loan-description">{loan.description}</div>
                      <div className="loan-progress-container">
                        <div className="loan-progress-bar">
                          <div 
                            className="loan-progress-fill" 
                            style={{ width: `${calculateProgress(loan.paymentsRemaining, loan.term)}%` }}
                          ></div>
                        </div>
                        <span className="loan-progress-text">
                          {calculateProgress(loan.paymentsRemaining, loan.term).toFixed(0)}% paid
                        </span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="collateral-cell">
                      <div className="collateral-info">
                        <span className="collateral-type">{loan.collateralType}</span>
                        <span className="collateral-value">
                          {loan.collateral > 0 ? formatCurrency(loan.collateral.toString()) : 'Uncollateralized'}
                        </span>
                      </div>
                      <div className="risk-badge" style={{ color: getRiskColor(loan.riskScore) }}>
                        {loan.riskScore} Risk
                      </div>
                      <div className="location-info">{loan.location}</div>
                    </div>
                  </td>
                  <td>
                    <div className="investment-cell">
                      <div className="available-tokens">
                        {formatCurrency(loan.availableTokens.toString())} available
                      </div>
                      <div className="total-supply">
                        of {formatCurrency(loan.totalTokenSupply.toString())} total
                      </div>
                      <div className="yield-info">
                        <span className="current-yield">{loan.currentYield}% APY</span>
                      </div>
                      <div className="returns-info">
                        {formatCurrency(loan.totalReturns.toString())} total returns
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="market-cell">
                      <div className="token-price">
                        ${loan.liquidityPool.price.toFixed(3)} per token
                      </div>
                      <div className="market-volume">
                        24h: {formatCurrency(loan.liquidityPool.volume24h.toString())}
                      </div>
                      <div className="pool-liquidity">
                        Liquidity: {formatCurrency(loan.liquidityPool.liquidity.toString())}
                      </div>
                    </div>
                  </td>
                  <td className="actions-cell">
                    <button 
                      className="btn btn-green-filled trade-action-btn"
                      onClick={() => handleBuy(loan)}
                    >
                      Buy Tokens
                    </button>
                    <button 
                      className="btn btn-red-outline trade-action-btn"
                      onClick={() => handleSell(loan)}
                    >
                      Sell Tokens
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TradePage; 