// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Croakens is ERC20 {

    constructor() ERC20('Croakens', 'C') {}
    
    function mint(address user, uint256 amount) public {
        _mint(user, amount);
    }
}