// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract Lottery{
    struct BetInfo{
        uint256 answerBlockNumber;
        address payable better;
        bytes challenges;
    }

    uint256 private _tail;
    uint256 private _head;
    mapping(uint256 => BetInfo) private _bets;

    address public owner;
    
    uint256 constant internal BLOCK_LIMIT = 256;
    uint256 constant internal BET_BLOCK_INTERVAL = 3;
    uint256 constant internal BET_AMOUNT = 5 * 10 ** 15;
    uint256 private _pot;

    constructor() public{
        owner = msg.sender;
    }

    function getSomeValue() public pure returns (uint256 value){
        return 5;
    }

    function getPot() public view returns (uint256 value) {
        return _pot;
    }
}