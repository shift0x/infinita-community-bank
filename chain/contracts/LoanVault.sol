// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import {ILoanVault} from './interfaces/ILoanVault.sol';

contract LoanVault is ILoanVault {

    address public bankVault;

    constructor(address _bankVault){
        bankVault = _bankVault;
    }
}