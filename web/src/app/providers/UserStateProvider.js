import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { getUserTokenBalance } from '../lib/tokenUtils';
import { lendingVaultContract, tokens } from '../lib/contracts';
import { chain, config } from '../lib/chain';
import { readContract } from 'viem/actions';
import { formatEther, formatUnits } from 'viem';

// Create the context
const UserStateContext = createContext();

// Custom hook to use the context
export const useUserState = () => {
  const context = useContext(UserStateContext);
  if (!context) {
    throw new Error('useStateBalance must be used within a UserStateProvider');
  }
  return context;
};

// Provider component
export const UserStateProvider = ({ children }) => {
  const { address, isConnected } = useAccount();
  const [balances, setBalances] = useState({ bank: 0, sBank: 0, usdc: 0 });
  const [loans, setLoans] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const getUserLoans = async () => {
    const client = config.getClient()

    const response = await readContract(client, {
      address: lendingVaultContract.addresses[chain.id],
      abi: lendingVaultContract.abi,
      functionName: 'getLoansForBorrower',
      args: [address], 
    });

    const loanStatus = {
      0: "Unknown",
      1: "Pending",
      2: "Open",
      3: "Closed",
      4: "Rejected"
    }

    const loans = response.map(loan => {
      return {
        id: loan.id,
        status: loanStatus[loan.status],
        borrower: loan.borrower,
        amount: Number(formatEther(loan.amount)),
        collateral: Number(formatEther(loan.collateral)),
        details: JSON.parse(loan.details),
        interestRate: Number(formatEther(loan.interestRate)),
        originalBalance: Number(formatEther(loan.originalBalance)),
        remainingBalance: Number(formatEther(loan.remainingBalance)),
        totalPaymentAmount: Number(formatEther(loan.totalPaymentAmount)),
        term: Number(formatUnits(loan.term, 0)),
        token: loan.token
      }
    });

    return loans;
  }

  // Function to fetch user balances
  const updateBalances = useCallback(async () => {
    if (!address || !isConnected) {
      setBalances({ bank: 0, sBank: 0, usdc: 0 });
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const chainId = chain.id;
      const tokenAddresses = tokens[chainId];

      // Fetch all balances concurrently
      const [bankBalance, sBankBalance, usdcBalance, userLoans] = await Promise.all([
        tokenAddresses?.BANK ? getUserTokenBalance({ 
          token: tokenAddresses.BANK, 
          owner: address 
        }) : 0,
        tokenAddresses?.sBANK ? getUserTokenBalance({ 
          token: tokenAddresses.sBANK, 
          owner: address 
        }) : 0,
        tokenAddresses?.USDC ? getUserTokenBalance({ 
          token: tokenAddresses.USDC, 
          owner: address 
        }) : 0,
        
        getUserLoans()
      ]);

      setBalances({
        bank: bankBalance,
        sBank: sBankBalance,
        usdc: usdcBalance
      });

      setLoans(userLoans);
    } catch (err) {
      console.error('Error fetching balances:', err);
      setError(err.message || 'Failed to fetch balances');
    } finally {
      setIsLoading(false);
    }
  }, [address, isConnected]);

  useEffect(() => {
    updateBalances()
  }, [updateBalances])


  const userLoanAmountOwed = loans.length == 0 ? 0 : loans
    .map(loan => { return loan.remainingBalance })
    .reduce((prev, curr) => { return prev+curr});

  const value = {
    balances,
    isLoading,
    error,
    updateBalances,
    bankBalance: balances.bank,
    sBankBalance: balances.sBank,
    usdcBalance: balances.usdc,
    userLoans: loans,
    userLoanAmountOwed
  };

  return (
    <UserStateContext.Provider value={value}>
      {children}
    </UserStateContext.Provider>
  );
};

export default UserStateProvider;
