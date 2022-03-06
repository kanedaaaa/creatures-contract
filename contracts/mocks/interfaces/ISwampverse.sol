// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

interface ISwampverse {
    function mint(address user, uint256 amount) external;
    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId
    ) external;
}