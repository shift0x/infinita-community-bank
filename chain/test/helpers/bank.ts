import { ethers } from "hardhat";
import { BankVault, IERC20, MintableToken } from "../../typechain-types"

export async function deposit(account: any , bank: BankVault, amount: string, usdc : MintableToken) {
    const amountAsBig = ethers.parseEther(amount);
    const bankAddress = await bank.getAddress();

    await usdc.mint(amountAsBig, account);
    await usdc.approve(bankAddress, amountAsBig);
    await bank.deposit(amountAsBig);
}

export async function stake(amount: string, bank: BankVault, bankToken: IERC20) {
    const amountAsBig = ethers.parseEther(amount);
    const bankAddress = await bank.getAddress();

    await bankToken.approve(bankAddress, amountAsBig);
    await bank.stake(amountAsBig);
}

export async function unstake(amount: string, bank: BankVault) {
    const amountAsBig = ethers.parseEther(amount);
    
    await bank.unstake(amountAsBig);
}