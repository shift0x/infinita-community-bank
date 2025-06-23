// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import {IMintableToken} from './interfaces/IMintableToken.sol';
import {ILoanVault} from './interfaces/ILoanVault.sol';
import {IBankVault} from './interfaces/IBankVault.sol';

import {MintableToken} from './MintableToken.sol';
import {LoanVault} from './LoanVault.sol';
import {TokenHolderInfo} from './Types.sol';

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {Math} from "@openzeppelin/contracts/utils/math/Math.sol";

/**
 * @notice Contract representing the bank deposit vault
 * @dev The bank operates by making loans on deposits. It maintains 20% of deposits for withdrawl
 * and uses the remaining proceeds for making loans. As such only 20% of deposits are reedemable at
 * any given point in time.
 *
 * When a deposit is made, the depositor receives BANK tokens which can be staked to receive a share
 * of earnings from the bank.
 *
 * Earning Sources:
 * 1. Interest on Loans
 * 2. Profits from loan sales
 */
contract BankVault is IBankVault {

    /// @notice mintable token representing bank deposits
    IMintableToken immutable public BANK;

    /// @notice mintable token representing staked bank deposits
    IMintableToken immutable public sBANK;

    /// @notice USDC token address
    IERC20 immutable public USDC;

    /// @notice Loan vault used to manage loan process
    ILoanVault immutable public loanVault;

    /// @notice total amount of tokens staked
    uint256 private _totalStake;
 
    /// @notice The bank currently does not have enough reserves to process the requested withdrawl
    error InsufficentBankReserves();

    /// @notice The staker does not have enough staked balance to process the requested withdrawl
    error InsufficentStakedBalanceForWithdrawl();

    /// @notice The staker does not have enough tokens for the requested staking amount
    error InsufficentTokenBalanceForStaking();

    constructor(
        address _usdc,
        address _loanOfficer
    ) {
        USDC = IERC20(_usdc);

        BANK = new MintableToken(address(this), "Infinita Community Bank", "BANK");
        sBANK = new MintableToken(address(this), "Staked BANK", "sBANK");
        loanVault = new LoanVault(IBankVault(address(this)), _usdc, _loanOfficer);
    }
 
    /**
     * @notice Deposit funds into the bank
     *
     * @param amount The deposit amount
     */
    function deposit(uint256 amount) public {
        // transfer user funds into the contract and mint new bank tokens
        // to send to the depositor
        USDC.transferFrom(msg.sender, address(this), amount);
        BANK.mint(amount, msg.sender);

        // the bank lends 80% of deposits and maintains 20% to service withdrawls.
        // calculate the deposited amount that should be used for lending and send it to the loan vault
        uint256 loanAmount = Math.mulDiv(amount, 80, 100);
        
        USDC.transfer(address(loanVault), loanAmount);
    }

    /**
     * @notice Withdraw funds from the bank
     * @dev This method throws an error if the bank does not have enough deposits to
     * cover the deposit amount
     *
     * @param amount The withdraw amount
     */
    function withdraw(uint256 amount) public {
        // get the funds available for withdrawl. If the vault does not have
        // enough funds to service the request, then raise an error
        uint256 availableBalance = USDC.balanceOf(address(this));

        if(availableBalance < amount)
            revert InsufficentBankReserves();

        // reduce supply of bank tokens by the withdrawl amount and transfer the users
        // the corresponding amount in USDC.
        BANK.burn(amount, msg.sender);
        USDC.transfer(msg.sender, amount);
    }

    /**
     * @notice Stake tokens with the bank to earn rewards
     * @dev This method will mint sBANK tokens 1:1 with the deposit amount
     *
     * @param amount The staking amount
     */
    function stake(uint256 amount) public {
        // verify the caller has enough BANK tokens for staking
        uint256 balance = BANK.balanceOf(msg.sender);

        if(balance < amount){
            revert InsufficentTokenBalanceForStaking();
        }

        // transfer the tokens to the vault contract and issue sBANK tokens
        // for use during reedem operations
        BANK.transferFrom(msg.sender, address(this), amount);
        sBANK.mint(amount, msg.sender);

        // update the total staked amount
        _totalStake += amount;
    }

    /**
     * @notice unstake staked tokens
     * @dev This method will burn sBANK tokens 1:1 with the withdraw amount
     *
     * @param amount The staking amount
     */
    function unstake(uint256 amount) public {
        // verify the caller has enough tokens stake to unstake
        uint256 stakedAmount = sBANK.balanceOf(msg.sender);

        if(stakedAmount < amount){
            revert InsufficentStakedBalanceForWithdrawl();
        }

        // burn the requested amount of staked tokens 
        // and transfer the original BANK token back to the user
        sBANK.burn(amount, msg.sender);
        BANK.transfer(msg.sender, amount); 
    }

    
    /**
     * @notice Distribute staking rewards to stakers proportional to their stake weight
     *
     * @param token The reward token
     * @param amount the reward amount to distribute
     */
    function distributeToStakers(
        address token, 
        uint256 amount
    ) public {
        // transfer the token amount into this contract
        IERC20(token).transferFrom(msg.sender, address(this), amount);

        // store variables as memory to avoid multiple state lookups
        TokenHolderInfo[] memory stakers = sBANK.getTokenHolderInfo();
        uint256 count = stakers.length; 
        uint256 totalStake = _totalStake;

        // for each staker, calculate their stake weight and send their
        // share of the specified token.
        for(uint256 i = 0; i < count; i++){
            TokenHolderInfo memory info = stakers[i];

            uint256 stakeWeight = Math.mulDiv(info.balance, 10**18, totalStake);
            uint256 tokenAmountToTransfer = Math.mulDiv(amount, stakeWeight, 10**18);

            IERC20(token).transfer(info.account, tokenAmountToTransfer);
        }
    }

}