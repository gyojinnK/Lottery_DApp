const Lottery = artifacts.require("Lottery");

// function의 parameter는 truffle에서 만든 10가지의 account 주소가 순서대로 들어옴, 0, 1, 2번 주소 순서대로
contract("Lottery", function ([deploy, user1, user2]) {
    let lottery;
    let betAmount = 5 * 10 ** 15;
    let betAmountBN = new web3.utils.BN("5000000000000000");
    let betBlockInterval = 3;
    beforeEach(async () => {
        lottery = await Lottery.new();
    });

    describe("Bet", function () {
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

    describe("Distribute", function () {
        describe("When the answer is checkable", function () {
            it("should give the user the got when the answer matches", async () => {
                // 두 글자 다 맞았을 때

                await lottery.setAnswerForTest(
                    "0xab0dcf712a622efcf37deff66439f1257055d50a79e2fd6414c5e8c9fd09c274",
                    { from: deploy }
                );
                await lottery.betAndDistribute("0xef", {
                    from: user2,
                    value: betAmount,
                }); // 1 -> 4
                await lottery.betAndDistribute("0xef", {
                    from: user2,
                    value: betAmount,
                }); // 2 -> 5
                await lottery.betAndDistribute("0xab", {
                    from: user1,
                    value: betAmount,
                }); // 3 -> 6
                await lottery.betAndDistribute("0xef", {
                    from: user2,
                    value: betAmount,
                }); // 4 -> 7
                await lottery.betAndDistribute("0xef", {
                    from: user2,
                    value: betAmount,
                }); // 5 -> 8
                await lottery.betAndDistribute("0xef", {
                    from: user2,
                    value: betAmount,
                }); // 6 -> 9

                let potBefore = await lottery.getPot(); // 0.01 ETH
                let user1BalanceBefore = await web3.eth.getBalance(user1);
                let receipt7 = await lottery.betAndDistribute("0xef", {
                    from: user2,
                    value: betAmount,
                }); // 7 -> 10 => user1에게 pot이 전송된다.
                let potAfter = await lottery.getPot(); // 0 ETH
                let user1BalanceAfter = await web3.eth.getBalance(user1); // Beofore + 0.015 ETH

                // pot의 변화량 확인
                assert.equal(
                    potBefore.toString(),
                    new web3.utils.BN("10000000000000000").toString()
                );
                assert.equal(
                    potAfter.toString(),
                    new web3.utils.BN("0").toString()
                );

                // user(winner)의 발란스 확인
                user1BalanceBefore = new web3.utils.BN(user1BalanceBefore);
                assert.equal(
                    user1BalanceBefore
                        .add(potBefore)
                        .add(betAmountBN)
                        .toString(),
                    new web3.utils.BN(user1BalanceAfter).toString()
                );
            });

            it("should give the user the amount he or she bet a single character matches", async () => {
                // 한 글자 만 맞았을 때
                await lottery.setAnswerForTest(
                    "0xab0dcf712a622efcf37deff66439f1257055d50a79e2fd6414c5e8c9fd09c274",
                    { from: deploy }
                );
                await lottery.betAndDistribute("0xef", {
                    from: user2,
                    value: betAmount,
                }); // 1 -> 4
                await lottery.betAndDistribute("0xef", {
                    from: user2,
                    value: betAmount,
                }); // 2 -> 5
                await lottery.betAndDistribute("0xaf", {
                    from: user1,
                    value: betAmount,
                }); // 3 -> 6
                await lottery.betAndDistribute("0xef", {
                    from: user2,
                    value: betAmount,
                }); // 4 -> 7
                await lottery.betAndDistribute("0xef", {
                    from: user2,
                    value: betAmount,
                }); // 5 -> 8
                await lottery.betAndDistribute("0xef", {
                    from: user2,
                    value: betAmount,
                }); // 6 -> 9

                let potBefore = await lottery.getPot(); // 0.01 ETH
                let user1BalanceBefore = await web3.eth.getBalance(user1);
                let receipt7 = await lottery.betAndDistribute("0xef", {
                    from: user2,
                    value: betAmount,
                }); // 7 -> 10 => user1에게 pot이 전송된다.
                let potAfter = await lottery.getPot(); // 0.01 ETH
                let user1BalanceAfter = await web3.eth.getBalance(user1); // Beofore + 0.005 ETH

                // pot의 변화량 확인
                assert.equal(potBefore.toString(), potAfter.toString());

                // user(winner)의 발란스 확인
                user1BalanceBefore = new web3.utils.BN(user1BalanceBefore);
                assert.equal(
                    user1BalanceBefore.add(betAmountBN).toString(),
                    new web3.utils.BN(user1BalanceAfter).toString()
                );
            });

            it.only("should get the eth of user when the answer does not match at all", async () => {
                // 다 틀렸을 때
                await lottery.setAnswerForTest(
                    "0xab0dcf712a622efcf37deff66439f1257055d50a79e2fd6414c5e8c9fd09c274",
                    { from: deploy }
                );
                await lottery.betAndDistribute("0xef", {
                    from: user2,
                    value: betAmount,
                }); // 1 -> 4
                await lottery.betAndDistribute("0xef", {
                    from: user2,
                    value: betAmount,
                }); // 2 -> 5
                await lottery.betAndDistribute("0xef", {
                    from: user1,
                    value: betAmount,
                }); // 3 -> 6
                await lottery.betAndDistribute("0xef", {
                    from: user2,
                    value: betAmount,
                }); // 4 -> 7
                await lottery.betAndDistribute("0xef", {
                    from: user2,
                    value: betAmount,
                }); // 5 -> 8
                await lottery.betAndDistribute("0xef", {
                    from: user2,
                    value: betAmount,
                }); // 6 -> 9

                let potBefore = await lottery.getPot(); // 0.01 ETH
                let user1BalanceBefore = await web3.eth.getBalance(user1);
                let receipt7 = await lottery.betAndDistribute("0xef", {
                    from: user2,
                    value: betAmount,
                }); // 7 -> 10 => user1에게 pot이 전송된다.
                let potAfter = await lottery.getPot(); // 0.015 ETH
                let user1BalanceAfter = await web3.eth.getBalance(user1); // Beofore

                // pot의 변화량 확인
                assert.equal(
                    potBefore.add(betAmountBN).toString(),
                    potAfter.toString()
                );

                // user(winner)의 발란스 확인
                user1BalanceBefore = new web3.utils.BN(user1BalanceBefore);
                assert.equal(
                    user1BalanceBefore.toString(),
                    new web3.utils.BN(user1BalanceAfter).toString()
                );
            });
        });
        describe("When the answer is not revealed(Not Mined)", function () {});
        describe("When the answer is not revealed(Block limit is passed)", function () {});
    });

    describe("isMatch", function () {
        let blockHash =
            "0xab0dcf712a622efcf37deff66439f1257055d50a79e2fd6414c5e8c9fd09c274";
        it("should be BettingResult.Win when two characters match", async () => {
            let matchingResult = await lottery.isMatch("0xab", blockHash);
            assert.equal(matchingResult, 1);
        });

        it("should be BettingResult.Win when two characters match", async () => {
            let matchingResult = await lottery.isMatch("0xcd", blockHash);
            assert.equal(matchingResult, 0);
        });

        it("should be BettingResult.Win when two characters match", async () => {
            let matchingResult = await lottery.isMatch("0xaf", blockHash);
            assert.equal(matchingResult, 2);

            matchingResult = await lottery.isMatch("0xfb", blockHash);
            assert.equal(matchingResult, 2);
        });
    });
});
