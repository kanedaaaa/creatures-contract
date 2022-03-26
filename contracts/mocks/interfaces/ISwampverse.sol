// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

interface ISwampverse {
    function mint(uint256 amount, address user) external;
    function transferFrom(
        address from,
        address to,
        uint256 tokenId
    ) external;
    function setApprovalForAll(address user, bool approved) external;
}