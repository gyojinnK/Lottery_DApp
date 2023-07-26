const Lottery = artifacts.require("Lottery");

// function의 parameter는 truffle에서 만든 10가지의 account 주소가 순서대로 들어옴, 0, 1, 2번 주소 순서대로
contract("Lottery", function ([deploy, user1, user2]) {
    let lottery;
    beforeEach(async () => {
        console.log("Before each");
        lottery = await Lottery.new();
    });

    it("Basic test", async () => {
        console.log("Basic test");
        let owner = await lottery.owner();
        let value = await lottery.getSomeValue();

        console.log(`owner: ${owner}`);
        console.log(`value: ${value}`);
        assert.equal(value, 5);
    });

    it.only("getPot should return current pot", async () => {
        let pot = await lottery.getPot();
        console.log(`pot: ${pot}`);
        assert.equal(pot, 0);
    });
});
