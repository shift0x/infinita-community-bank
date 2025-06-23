import {loadFixture} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import hre, { ethers } from "hardhat";
import { LoanVault, MintableToken } from "../typechain-types";
import { getState } from "./helpers/amounts";
import { deposit, stake } from "./helpers/bank";

describe ("Loan Vault Tests", () => {

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

    async function createLoanRequest(loanVault: LoanVault, amount : number, collateral: number, term: number, details: string, usdc: MintableToken) {
        const [account] = await hre.ethers.getSigners();
        
        const loanAmountBig = ethers.parseEther(amount.toString());
        const collateralAmountBig = ethers.parseEther(collateral.toString());

        await usdc.mint(collateralAmountBig, account);
        await usdc.approve(loanVault, collateralAmountBig);
        await loanVault.submitLoanRequest(loanAmountBig, collateralAmountBig, term.toString(), details);
    }

    async function getAccountLoans(loanVault: LoanVault, account: any) : Promise<any[]> {
        const loans : any[] = [];
        const infos = await loanVault.getLoansForBorrower(account);

        for(var i = 0; i < infos.length; i++){
            const loan = infos[i];

            const model : any = {}

            model.id = loan.id;
            model.status = Number(ethers.formatUnits(loan.status, 0));
            model.borrower = loan.borrower;
            model.details = loan.details;
            model.token = await hre.ethers.getContractAt("IERC20", loan.token);

            model.amount = Number(ethers.formatEther(loan.amount));
            model.collateral = Number(ethers.formatEther(loan.collateral));
            model.term = Number(ethers.formatUnits(loan.term, 0));
            model.interestRate = Number(ethers.formatEther(loan.interestRate));
            model.remainingBalance = Number(ethers.formatEther(loan.remainingBalance));
            model.originalBalance = Number(ethers.formatEther(loan.originalBalance));
            model.totalPaymentAmount = Number(ethers.formatEther(loan.totalPaymentAmount));
            model.principalAmountPerDollarOwed = Number(ethers.formatEther(loan.principalAmountPerDollarOwed));

            loans.push(model);
        }

        return loans;
    }

    describe("Loan Info", async () => {

        it("should get all loans by user", async () => {
            const { loanVault, usdc } = await loadFixture(setup);
            const [deployer, otherAddress] = await hre.ethers.getSigners();

            const loanAmount = 100;
            const collateralAmount = 20;
            const loanTerm = 36;
            const loanDetails = "{info: 'something'}"

            await createLoanRequest(loanVault, loanAmount, collateralAmount, loanTerm, loanDetails, usdc)
            await createLoanRequest(loanVault, loanAmount, collateralAmount, loanTerm, loanDetails, usdc)
            await createLoanRequest(loanVault, loanAmount, collateralAmount, loanTerm, loanDetails, usdc)

            const account1Loans = await getAccountLoans(loanVault, deployer)
            const account2Loans = await getAccountLoans(loanVault, otherAddress);

            expect(account1Loans.length).is.equal(3);
            expect(account2Loans.length).is.equal(0);
        })  

    })

    describe("Loan Requests", async () => {

        it("should create new loan request", async () => {
            const { loanVault, deployerAddress, usdc } = await loadFixture(setup);

            const loanAmount = 100;
            const collateralAmount = 20;
            const loanTerm = 36;
            const loanDetails = "{info: 'something'}"

            await createLoanRequest(loanVault, loanAmount, collateralAmount, loanTerm, loanDetails, usdc)

            const borrowerLoans = await getAccountLoans(loanVault, deployerAddress); 
            const loan = borrowerLoans[0];

            expect(loan.amount).is.equal(loanAmount);
            expect(loan.collateral).is.equal(collateralAmount);
            expect(loan.term).is.equal(loanTerm);
            expect(loan.details).is.equal(loanDetails);
        });

        it("should approve loan", async () => {
            const { loanVault, bankToken, sBankToken, deployerAddress, usdc } = await loadFixture(setup);

            const loanAmount = 100
            const collateralAmount = 20

            await createLoanRequest(loanVault, loanAmount, collateralAmount, 36,  "{info: 'something'}", usdc)
            
            const loan = (await getAccountLoans(loanVault, deployerAddress))[0]; 

            const interestRate = 6.75;
            const interestRateBig = ethers.parseEther(interestRate.toString())
            const totalPaymentAmount = 200;
            const totalPaymentAmountBig = ethers.parseEther(totalPaymentAmount.toString())

            const loanVaultBalance = 500

            await usdc.mint(ethers.parseEther(loanVaultBalance.toString()), loanVault);
            await loanVault.finalizeLoanTerms(loan.id, interestRateBig , totalPaymentAmountBig);

            const updatedLoan = (await getAccountLoans(loanVault, deployerAddress))[0]; 
            const loanVaultBalances = await getState(loanVault, bankToken, sBankToken, usdc);
            const loanVaultLoanTokenBalance = Number(ethers.formatEther(await loan.token.balanceOf(loanVault)));


            expect(updatedLoan.status).is.equal(2);
            expect(updatedLoan.interestRate).is.equal(interestRate);
            expect(updatedLoan.totalPaymentAmount).is.equal(totalPaymentAmount)
            expect(loanVaultLoanTokenBalance).is.equal(totalPaymentAmount)
            
            expect(loanVaultBalances.usdcBalance).is.equal(loanVaultBalance-loanAmount+collateralAmount);
        });

        it("should deny loan", async () => {
            const { loanVault, bankToken, sBankToken, deployerAddress, usdc } = await loadFixture(setup);

            const loanAmount = 100
            const collateralAmount = 20

            await createLoanRequest(loanVault, loanAmount, collateralAmount, 36,  "{info: 'something'}", usdc)
            
            const loan = (await getAccountLoans(loanVault, deployerAddress))[0]; 

            await loanVault.rejectLoan(loan.id);

            const updatedLoan = (await getAccountLoans(loanVault, deployerAddress))[0]; 

            const borrowerBalances = await getState(deployerAddress, bankToken, sBankToken, usdc)

            expect(borrowerBalances.usdcBalance).is.equal(collateralAmount);
            expect(updatedLoan.status).is.equal(4);
        });
    })

    describe("Loan Payments", async () => {

        it("should process loan payment", async () => {
            const { loanVault, bank, bankToken, sBankToken, deployerAddress, usdc } = await loadFixture(setup);
            const [, otherAddress] = await hre.ethers.getSigners();

            await createLoanRequest(loanVault, 100, 0, 36,  "{info: 'something'}", usdc)
            
            const loan = (await getAccountLoans(loanVault, deployerAddress))[0]; 

            await deposit(deployerAddress, bank, "500", usdc)
            await stake("500", bank, bankToken)

            await loanVault.finalizeLoanTerms(loan.id, ethers.parseEther("5"), ethers.parseEther("200"));

            const finalizedLoan = (await getAccountLoans(loanVault, deployerAddress))[0]; 

            // transfer the stake to another owner
            await sBankToken.transfer(otherAddress, ethers.parseEther("500"))

            // make a payment
            await usdc.mint(ethers.parseEther("20"), deployerAddress)
            await usdc.approve(loanVault, ethers.parseEther("20"))
            await loanVault.makeLoanPayment(loan.id, ethers.parseEther("20"))

            // the payment interest should have been transfered to the otherAddress (sToken owner)
            const stakerBalances = await getState(otherAddress, bankToken, sBankToken, usdc)

            const updatedLoan = (await getAccountLoans(loanVault, deployerAddress))[0]; 

            expect(stakerBalances.usdcBalance).is.equal(10);
            expect(updatedLoan.remainingBalance).is.equal(finalizedLoan.remainingBalance-20);
        });

    })
});