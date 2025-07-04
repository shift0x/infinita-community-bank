import { erc20Abi, formatEther, parseEther } from 'viem';
import { readContract } from 'viem/actions';
import { config } from './chain';
import { erc20ABI } from './contracts';


export async function getUserTokenBalance({ 
  token,
  owner
}) {
    const client = config.getClient()
        
    const response = await readContract(client, {
      address: token,
      abi: erc20ABI,
      functionName: 'balanceOf',
      args: [owner], 
    });

    const balance = Number(formatEther(response));

    return balance;
  }

export async function ensureTokenApproval({ 
  tokenAddress, 
  ownerAddress, 
  spenderAddress, 
  amount, 
  writeContractAsync 
}) {
  const client = config.getClient();
  
  try {
    // Check current allowance
    const response = await readContract(client, {
      address: tokenAddress,
      abi: erc20Abi,
      functionName: 'allowance',
      args: [ownerAddress, spenderAddress], 
    });

    const allowance = Number(formatEther(response));

    // If allowance is sufficient, return early
    if (allowance >= Number(amount)) {
      return null;
    }

    // Approve the required amount
    const desiredAllowanceBig = parseEther(amount.toString());

    const tx = {
      address: tokenAddress,
      abi: erc20Abi,
      functionName: 'approve',
      args: [spenderAddress, desiredAllowanceBig]
    };

    await writeContractAsync(tx);
    return null;
  } catch (err) {
    return err;
  }
}