// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

interface ICroakens {
    function mint(address user, uint256 amount) external;
    function balanceOf(address user) external view returns (uint256);
    function approve(address user, uint256 amount) external;
    function transferFrom(address from, address to, uint256 amount) external;
}