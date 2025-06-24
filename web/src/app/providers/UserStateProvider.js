import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { getUserTokenBalance } from '../lib/tokenUtils';
import { tokens } from '../lib/contracts';
import { chain } from '../lib/chain';

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
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

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
      const [bankBalance, sBankBalance, usdcBalance] = await Promise.all([
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
        }) : 0
      ]);

      setBalances({
        bank: bankBalance,
        sBank: sBankBalance,
        usdc: usdcBalance
      });
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


  const value = {
    balances,
    isLoading,
    error,
    updateBalances,
    // Convenience getters
    bankBalance: balances.bank,
    sBankBalance: balances.sBank,
    usdcBalance: balances.usdc,
  };

  return (
    <UserStateContext.Provider value={value}>
      {children}
    </UserStateContext.Provider>
  );
};

export default UserStateProvider;
