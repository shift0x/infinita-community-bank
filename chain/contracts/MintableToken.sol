// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {IMintableToken} from './interfaces/IMintableToken.sol';

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {TokenHolderInfo} from './Types.sol';


contract MintableToken is ERC20, IMintableToken {

    address public minter;

    address[] private _tokenHolders;
    mapping(address => bool) private _knownHoldersLookup;

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

    /// @inheritdoc ERC20
    function transfer(address to, uint256 value) public virtual override (ERC20, IERC20) returns (bool) {
        _registerTokenHolder(to);

        return super.transfer(to, value);
    }

    /// @inheritdoc ERC20
    function transferFrom(address from, address to, uint256 value) public virtual override (ERC20, IERC20) returns (bool) {
        _registerTokenHolder(to);

        return super.transferFrom(from, to, value);
    }

    function mint(
        uint256 amount,
        address to
    ) public onlyTokenMinter {
        transferFrom(address(0), to, amount);
    }

    function burn(
        uint256 amount,
        address owner
    ) public onlyTokenMinter {
        transferFrom(owner, address(0), amount);
    }

    function getTokenHolderInfo() public view returns(TokenHolderInfo[] memory infos) {
        address[] memory holders = _tokenHolders;

        infos = new TokenHolderInfo[](holders.length);

        for(uint256 i = 0; i < holders.length; i++){
            address holder = holders[i];
            uint256 balance = this.balanceOf(holder);

            infos[i] = TokenHolderInfo({
                account: holder,
                balance: balance
            });
        }
    }

    

    function _registerTokenHolder(address holder) private {
        if(_knownHoldersLookup[holder] == true){ return; }

        _knownHoldersLookup[holder] = true;

        _tokenHolders.push(holder);
    }

}
