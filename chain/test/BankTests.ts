import {loadFixture} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import hre, { ethers } from "hardhat";
import { BankVault, IERC20, MintableToken } from "../typechain-types";
import { getState } from "./helpers/amounts";
import { deposit, stake, unstake } from "./helpers/bank";

describe ("Bank Tests", () => {

    async function setup(){
        const [deployer] = await hre.ethers.getSigners();

        const mintableTokenContract = await hre.ethers.getContractFactory("MintableToken");
        const usdc = await mintableTokenContract.deploy(deployer, "USDC", "USDC");
        
        await usdc.waitForDeployment();

        const bankContract = await hre.ethers.getContractFactory("BankVault");
        const bank = await bankContract.deploy(usdc, deployer);

        await bank.waitForDeployment();

        const loanVaultAddress = await bank.loanVault();
        const loanVault = await hre.ethers.getContractAt("LoanVault", loanVaultAddress)

        const bankTokenAddress = await bank.BANK();
        const bankToken = await hre.ethers.getContractAt("ERC20", bankTokenAddress);

        const sBankTokenAddress = await bank.sBANK();
        const sBankToken = await hre.ethers.getContractAt("ERC20", sBankTokenAddress);

        const deployerAddress = await deployer.getAddress();
        const bankAddress = await bank.getAddress();
        
        return { deployer, deployerAddress,bankAddress,loanVaultAddress, bank, bankToken, sBankToken, loanVault, usdc }
    }

    describe("Deposit", () => {

        it("should deposit funds into bank", async () => {
            const { deployerAddress, bank, usdc, bankToken, sBankToken, loanVaultAddress, bankAddress } = await loadFixture(setup);
            
            const depositAmount = 100;

            await deposit(deployerAddress, bank, depositAmount.toString(), usdc);
            
            const depositorTokenBalances = await getState(deployerAddress, bankToken, sBankToken, usdc);
            const bankTokenBalances = await getState(bankAddress, bankToken, sBankToken, usdc);
            const loanVaultBalances = await getState(loanVaultAddress, bankToken, sBankToken, usdc);

            expect(depositorTokenBalances.usdcBalance).is.equal(0);
            expect(depositorTokenBalances.bankTokenBalance).is.equal(depositAmount);
            
            expect(bankTokenBalances.usdcBalance).is.equal(depositAmount * .2);
            
            expect(loanVaultBalances.usdcBalance).is.equal(depositAmount * .8);
        });
    })

    describe("Withdraw", () => {

        it("should withdraw funds from bank", async () => {
            const { deployerAddress, bank, usdc, bankToken, sBankToken, bankAddress } = await loadFixture(setup);
            
            const depositAmount = 100;
            const withdrawAmount = depositAmount*.2;
            const withdrawAmountBig = ethers.parseEther(withdrawAmount.toString());

            await deposit(deployerAddress, bank, depositAmount.toString(), usdc);
            await bank.withdraw(withdrawAmountBig);

            const depositorTokenBalances = await getState(deployerAddress, bankToken, sBankToken, usdc);
            const bankTokenBalances = await getState(bankAddress, bankToken, sBankToken, usdc);

            expect(depositorTokenBalances.usdcBalance).is.equal(withdrawAmount);
            expect(depositorTokenBalances.bankTokenBalance).is.equal(depositAmount-withdrawAmount);

            expect(bankTokenBalances.usdcBalance).is.equal((depositAmount*.2)-withdrawAmount);

        });
        
    })

    describe("Staking", () => {

        it("should stake deposit tokens with bank", async () => {
            const { deployerAddress, bank, usdc, bankToken, sBankToken } = await loadFixture(setup);
            
            const depositAmount = 100;

            await deposit(deployerAddress, bank, depositAmount.toString(), usdc);
            await stake(depositAmount.toString(), bank, bankToken);

            const depositorTokenBalances = await getState(deployerAddress, bankToken, sBankToken, usdc);

            expect(depositorTokenBalances.bankTokenBalance).is.equal(0);
            expect(depositorTokenBalances.sBankTokenBalance).is.equal(depositAmount);
        })

        it("should distribute staking rewards to stakers", async () => {
            const { deployerAddress, bank, usdc, bankToken, sBankToken } = await loadFixture(setup);
            
            const depositAmount = 100;
            const stakingRewards = 10;
            const stakingRewardsBig = ethers.parseEther(stakingRewards.toString());
 
            await deposit(deployerAddress, bank, depositAmount.toString(), usdc);
            await stake(depositAmount.toString(), bank, bankToken);
            await usdc.approve(bank, stakingRewardsBig);
            await usdc.mint(stakingRewardsBig, deployerAddress);
            await bank.distributeToStakers(usdc, stakingRewardsBig);

            const depositorTokenBalances = await getState(deployerAddress, bankToken, sBankToken, usdc);

            expect(depositorTokenBalances.usdcBalance).is.equal(stakingRewards);
            expect(depositorTokenBalances.sBankTokenBalance).is.equal(depositAmount);

        })

        it("should distribute partial staking rewards to stakers", async () => {
            const { deployerAddress, bank, usdc, bankToken, sBankToken } = await loadFixture(setup);
            const [deployer, otherAddress] = await hre.ethers.getSigners();
            
            const depositAmount = 100;
            const transferAmount = 50;
            const stakingRewards = 10;
            const stakingRewardsBig = ethers.parseEther(stakingRewards.toString());
            
            await deposit(deployerAddress, bank, depositAmount.toString(), usdc);
            await stake(depositAmount.toString(), bank, bankToken);

            await sBankToken.transfer(otherAddress, ethers.parseEther(transferAmount.toString()))

            await usdc.approve(bank, stakingRewardsBig);
            await usdc.mint(stakingRewardsBig, deployerAddress);
            await bank.distributeToStakers(usdc, stakingRewardsBig);

            const depositorTokenBalances = await getState(deployerAddress, bankToken, sBankToken, usdc);

            expect(depositorTokenBalances.usdcBalance).is.equal(stakingRewards * (1-(transferAmount/depositAmount)));

        })

        it("should unstake tokens", async () => {
            const { deployerAddress, bank, usdc, bankToken, sBankToken } = await loadFixture(setup);
            
            const depositAmount = 100;
            const unstakeAmount = 30;

            await deposit(deployerAddress, bank, depositAmount.toString(), usdc);
            await stake(depositAmount.toString(), bank, bankToken);
            await unstake(unstakeAmount.toString(), bank);

            const depositorTokenBalances = await getState(deployerAddress, bankToken, sBankToken, usdc);

            expect(depositorTokenBalances.bankTokenBalance).is.equal(unstakeAmount);
            expect(depositorTokenBalances.sBankTokenBalance).is.equal(depositAmount-unstakeAmount);

        });

    })

});