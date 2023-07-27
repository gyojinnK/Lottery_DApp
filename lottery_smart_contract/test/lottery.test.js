const Lottery = artifacts.require("Lottery");

// function의 parameter는 truffle에서 만든 10가지의 account 주소가 순서대로 들어옴, 0, 1, 2번 주소 순서대로
contract("Lottery", function ([deploy, user1, user2]) {
    let lottery;
    let betAmount = 5 * 10 ** 15;
    let betBlockInterval = 3;
    beforeEach(async () => {
        lottery = await Lottery.new();
    });

    describe.only("Bet", function () {
        it("should fail when the bet money is not 0.005 ETH", async () => {
            // Fail transaction
            await lottery.bet("0xab", { from: user1, value: 4000000000000000 });
            //transaction object {chainID, value, to, from, gas(Limit), gasPrice}
        });
        it("should put the bet to the bet queue with 1 bet", async () => {
            // bet
            let receipt = await lottery.bet("0xab", {
                from: user1,
                value: betAmount,
            });
            // console.log(receipt);

            let pot = await lottery.getPot();
            assert.equal(pot, 0);

            // check contract balance == 0.005
            let contractBalance = await web3.eth.getBalance(lottery.address);
            assert.equal(contractBalance, betAmount);

            // check bet info
            let currentBlockNumber = await web3.eth.getBlockNumber();
            let bet = await lottery.getBetInfo(0);
            assert.equal(
                bet.answerBlockNumber,
                currentBlockNumber + betBlockInterval
            );
            assert.equal(bet.bettor, user1);
            assert.equal(bet.challenges, "0xab");

            // check log
            console.log(receipt);
        });
    });
});
