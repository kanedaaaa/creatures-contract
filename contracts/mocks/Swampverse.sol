// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

contract MockCollection is ERC721Enumerable {
    constructor() ERC721 ("Swampverse", "S") {}
    
    function mint(uint256 _amount, address _user) public {
        for (uint256 i; i<_amount; ++i) {
            _safeMint(_user, totalSupply());
        }
    }
} 