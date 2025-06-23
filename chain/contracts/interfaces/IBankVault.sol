// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;


interface IBankVault {
    function distributeToStakers(address token, uint256 amount) external;
}