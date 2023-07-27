// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract Lottery{
    struct BetInfo{
        uint256 answerBlockNumber;
        address bettor;
        bytes1 challenges;
    }

    uint256 private _tail;
    uint256 private _head;
    mapping(uint256 => BetInfo) private _bets;

    address public owner;

    uint256 constant internal BLOCK_LIMIT = 256;
    uint256 constant internal BET_BLOCK_INTERVAL = 3;
    uint256 constant internal BET_AMOUNT = 5 * 10 ** 15;
    uint256 private _pot;

    enum BlockStatus {Checkable, NotRevealed, BlockLimitPassed}
    event BET(uint256 index, address bettor, uint256 amount, bytes1 challenges, uint256 answerBlockNumber);

    constructor() public{
        owner = msg.sender;
    }
    function getPot() public view returns (uint256 value) {
        return _pot;
    }

    /**
     * @dev 베팅을 한다. 유저는 0.005 ETH를 보내야하고, 베팅용 1 byte 글자를 보낸다.
     * 큐에 저장된 베팅 정보는 이후 distribute 함수에서 해결된다.
     * @param challenges 유저가 베팅하는 글자
     * @return result 함수가 잘 수행되었는지 확인하는 bool 값
     */
    function bet(bytes1 challenges) public payable returns (bool result){
        // check the proper ether is sent
        require(msg.value == BET_AMOUNT, "Not enough ETH");

        // push bet to the queue
        require(pushBet(challenges), "Fail to add a new Bet Info");

        // emit event
        emit BET(_tail - 1, msg.sender, msg.value, challenges, block.number + BET_BLOCK_INTERVAL);
    }
    // - save the bet to the queue

    // Distribute
    function distribute() public {
        // head 3 4 5 6 7 8 9 10 11 tail
        // 3번 값을 확인 해보고 정답이면 돈 지급
        // 아니라면 pot 머니에 저장
        // 너무 밀려서 3 ... 286 이라면 돈 리턴
        uint256 cur;
        BetInfo memory b;
        BlockStatus currentBlockStatus;

        for(cur=_head; cur < _tail; cur++){
            b = _bets[cur];
            currentBlockStatus = getBLockStatus(b.answerBlockNumber);

            // Checkable : block.number > AnswerBlockNumber && block.number < BLOCK_LIMIT + AnswerBlockNumber
            if(currentBlockStatus == BlockStatus.Checkable){
                // if win, bettor gets pot
                
                // if fail, better's money goes pot

                // if draw, refund bettor's money
            }

            // Not Revealed : block.number <= AnswerBlockNumber
            if(currentBlockStatus == BlockStatus.NotRevealed){
                break;
            }

            // Block limit passed : block.number >= AnswerBlockNumber + BLOCK_LIMIT
            if(currentBlockStatus == BlockStatus.BlockLimitPassed){
                // refund
                // emit refund
            }
            
            popBet(cur);
        }
    }
    
    function getBLockStatus(uint256 answerBlockNumber) internal view returns (BlockStatus) {
        if(block.number > answerBlockNumber && block.number < BLOCK_LIMIT + answerBlockNumber)
            return BlockStatus.Checkable;

        if(block.number <= answerBlockNumber)
            return BlockStatus.NotRevealed;

        if(block.number >= answerBlockNumber + BLOCK_LIMIT)
            return BLcokStatus.BlockLimitPassed;

        return BlockStatus.BlockLimitPassed
    }

    function getBetInfo(uint256 index) public view returns (uint256 answerBlockNumber, address bettor, bytes1 challenges){
        BetInfo memory b = _bets[index];
        answerBlockNumber = b.answerBlockNumber;
        bettor = b.bettor;
        challenges = b.challenges;
    }

    function pushBet(bytes1 challenges) internal returns (bool){
        BetInfo memory b;
        b.bettor = msg.sender;
        b.answerBlockNumber = block.number + BET_BLOCK_INTERVAL;
        b.challenges = challenges;

        _bets[_tail] = b;
        _tail++;

        return true;
    }

    function popBet(uint256 index) internal returns (bool){
        // delete하면 데이터를 저장하지 않겠다는 의미로 일정량의 가스비를 돌려받음
        delete _bets[index];
        return true;
    }
}