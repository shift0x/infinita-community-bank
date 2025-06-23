// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import {ILoanVault} from './interfaces/ILoanVault.sol';
import {IBankVault} from './interfaces/IBankVault.sol';
import {LoanInfo, LoanStatus, TokenHolderInfo} from './Types.sol';
import {IMintableToken} from './interfaces/IMintableToken.sol';
import {MintableToken} from './MintableToken.sol';

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {Math} from "@openzeppelin/contracts/utils/math/Math.sol";

import {LoanInfoLib} from './lib/LoanInfo.sol';


/**
 * @notice Contract responsible for loan origination, payment processing and distribution to relevant parties
 * @dev  The loans created by this contract go through a simple flow, where they are requested by any party
 * and approved by a representative at the bank (loan officer). Once a loan is approved, the funds are sent
 * to the borrower and tokens are issued corresponding to the expected future payments. A market is also
 * created to facilitate buying/selling loans. 
 *
 * When payments are made on the loan, the outstanding loan token balance is reduced and the repayment is sent to
 * token holders.
 *
 * Loan can also be bought and sold at any time. After origination the bank holds 100% of the loan tokens, but has
 * the goal of selling the tokens so that it can make more loans. 
 */
contract LoanVault is ILoanVault {
    using LoanInfoLib for mapping(bytes32 => LoanInfo);

    /// @notice address of the bank vault
    IBankVault immutable public VAULT;

    /// @notice loans are issued and repaid in USDC
    address immutable public USDC;

    /// @notice the loan officer responsible for approving or rejecting loans
    address immutable public LoanOfficer;

    /**
     * @notice Mapping between loan id and the corresponding loan
     * @dev mapping(id => LoanInfo)
     * id = keccak256(abi.encode(block.timestamp, msg.sender, amount, details));
     */
    mapping(bytes32 => LoanInfo) loanInfos;

     /**
     * @notice Mapping between borrowers and their loans
     * @dev mapping(address => LoanId)
     */
    mapping(address => bytes32[]) loansByBorrower;

    /// @dev Only loan officers are permitted to approve and reject loans
    modifier onlyLoanOfficer(){
        require(msg.sender == LoanOfficer, "unauthorized");
        _;
    }

    constructor(IBankVault _vault, address _usdc, address _loanOfficer){
        VAULT = _vault;
        USDC = _usdc;
        LoanOfficer = _loanOfficer;
    }

    /**
     * @notice Get all the loans for a given borrower
     *
     * @param borrower The borrower to get loans for
     */
    function getLoansForBorrower(
        address borrower
    ) public view returns (LoanInfo[] memory loans) {
        // gather the loanIds for the given user
        bytes32[] memory userLoanIds = loansByBorrower[borrower];
        loans = new LoanInfo[](userLoanIds.length);

        // for each loanId get and store the LoanInfo
        for(uint256 i = 0; i < userLoanIds.length; i++){
            loans[i] = loanInfos[userLoanIds[i]];
        }

        return loans;
    }

    /**
     * @notice Submits a loan request for review
     * @dev This method can be called by anyone. Offline the loan officer will evaluate the loan request
     * and determine if the loan is suitable for approval
     *
     * @param amount The requested loan amount
     * @param collateral The amount of collateral being submitted with the loan. Higher collateral = less loan risk
     * @param term The number of months the user has to repay the loan
     * @param details A json representation of additional info attached to the loan request
     */
    function submitLoanRequest(
        uint256 amount, 
        uint256 collateral, 
        uint256 term, 
        string memory details) 
    public returns (bytes32 id) {
        // Create the loan with the given params
        LoanInfo memory loan = loanInfos.create(amount, collateral, term, details, USDC);

        // Add the loan to the users list of loans 
        loansByBorrower[msg.sender].push(loan.id);

        return loan.id;
    }

    /**
     * @notice Handles the approval of a loan
     * @dev This method can only be called by the LoanOfficer. This method fails if the loan is in any other status
     * other than pending. Non pending loans have already been processed
     *
     * @param id The id of the loan to approve
     * @param interestRate The interest rate assigned to the loan by the loan officer
     * @param totalPaymentAmount The total repayment amount for the loan
     */
    function finalizeLoanTerms(
        bytes32 id, 
        uint256 interestRate, 
        uint256 totalPaymentAmount) 
    public onlyLoanOfficer {
        // Store the loan terms and send tokens to the borrower
        // This fails if the vault does not have enough tokens to transfer
        LoanInfo memory loan = loanInfos.finaize(id, interestRate, totalPaymentAmount);
        
        // mint the tokens corresponding to the total loan repayment amount. with the LoanVault as
        // the owner of all the tokens
        loan.token.mint(totalPaymentAmount, address(this));   

        // TODO: open new loan market
    }

    /**
     * @notice Rejects a pending loan for approval
     * @dev This method can only be called by the LoanOfficer. This method fails if the loan is in any other status
     * other than pending. Non pending loans have already been processed
     *
     * @param id The id of the loan to reject
     */
    function rejectLoan(
        bytes32 id
    ) public onlyLoanOfficer {
        // Process the loan rejection
        loanInfos.reject(id, USDC);
    }

    /**
     * @notice Process a loan payment
     * @dev This method will also distribute the loan proceeds to holders of the loan token. This also means distributing
     * rewards to stakers
     *
     * @param id The id of the loan to make a payment for
     * @param amount The amount of the loan payment
     */
    function makeLoanPayment(
        bytes32 id,
        uint256 amount 
    ) public {
        // update loan amounts and distribute payments to loan holders
        LoanInfo memory loan = loanInfos.processPayment(id, amount, USDC);        
        
        // send payment amounts to holders and bank profits to stakers
        _distributePaymentsToLoanHolders(loan, amount);
    }

    /**
     * @notice Send loan payments to the relevant parties
     * @dev This will distribute the loan proceeds to holders of the loan token. This also means distributing
     * rewards to stakers
     *
     * @param loan The loan to process
     * @param payment The amount of the loan payment
     */
    function _distributePaymentsToLoanHolders(
        LoanInfo memory loan,
        uint256 payment
    ) private {
        TokenHolderInfo[] memory loanHolders = loan.token.getTokenHolderInfo();
        uint256 loanTokenSupply = loan.token.totalSupply();

        for(uint256 i = 0; i < loanHolders.length;i++){
            // Calculate the amount of the repayment that should be sent to the holder
            TokenHolderInfo memory holder = loanHolders[i];

            uint256 stakeWeight = Math.mulDiv(holder.balance, 10**18, loanTokenSupply);
            uint256 payoutAmount = Math.mulDiv(stakeWeight, payment, 10**18);
            
            // short circuit if the payout amount is 0
            if(payoutAmount == 0) { continue; }

            // burn the payment amount in loan tokens since the loan is being repaid
            loan.token.burn(payoutAmount, holder.account);

            // If the loan vault is the loan holder, then retain the principal repayment for future loans
            // and distribute the interest to stakers
            if(holder.account == address(this)){
                uint256 principalAmount = Math.mulDiv(payoutAmount, loan.principalAmountPerDollarOwed, 10**18);
                uint256 interestAmount = payoutAmount - principalAmount;

                IERC20(USDC).approve(address(VAULT), interestAmount);

                // distribute loan interest to token stakers
                VAULT.distributeToStakers(USDC, interestAmount);

                IERC20(USDC).approve(address(VAULT), 0);
            } else {
                IERC20(USDC).transfer(holder.account, payoutAmount);
            }
        }
    }
    
}