// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {IMintableToken} from './interfaces/IMintableToken.sol';

contract MintableToken is ERC20, IMintableToken {

    address public minter;

    modifier onlyTokenMinter(){
        require(msg.sender == minter, "unauthorized");
        _;
    }

    constructor(
        address _minter,
        string memory name,
        string memory symbol
    ) ERC20(name, symbol) {
        minter = _minter;
    }

    function mint(
        uint256 amount,
        address to
    ) public onlyTokenMinter {
        this.transferFrom(address(0), to, amount);
    }

    function burn(
        uint256 amount,
        address owner
    ) public onlyTokenMinter {
        this.transferFrom(owner, address(0), amount);
    }

}
