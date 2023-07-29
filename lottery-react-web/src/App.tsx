import React, { useState, useEffect } from "react";
import Web3 from "web3";

const lotteryAddress = "0xD1Bbd3bf3457FA084E390AE1ad38E4549a8EbdF3";
const lotteryABI = [
    { inputs: [], stateMutability: "nonpayable", type: "constructor" },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: "uint256",
                name: "index",
                type: "uint256",
            },
            {
                indexed: false,
                internalType: "address",
                name: "bettor",
                type: "address",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "amount",
                type: "uint256",
            },
            {
                indexed: false,
                internalType: "bytes1",
                name: "challenges",
                type: "bytes1",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "answerBlockNumber",
                type: "uint256",
            },
        ],
        name: "BET",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: "uint256",
                name: "index",
                type: "uint256",
            },
            {
                indexed: false,
                internalType: "address",
                name: "bettor",
                type: "address",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "amount",
                type: "uint256",
            },
            {
                indexed: false,
                internalType: "bytes1",
                name: "challenges",
                type: "bytes1",
            },
            {
                indexed: false,
                internalType: "bytes32",
                name: "answer",
                type: "bytes32",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "answerBlockNumber",
                type: "uint256",
            },
        ],
        name: "DRAW",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: "uint256",
                name: "index",
                type: "uint256",
            },
            {
                indexed: false,
                internalType: "address",
                name: "bettor",
                type: "address",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "amount",
                type: "uint256",
            },
            {
                indexed: false,
                internalType: "bytes1",
                name: "challenges",
                type: "bytes1",
            },
            {
                indexed: false,
                internalType: "bytes32",
                name: "answer",
                type: "bytes32",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "answerBlockNumber",
                type: "uint256",
            },
        ],
        name: "FAIL",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: "uint256",
                name: "index",
                type: "uint256",
            },
            {
                indexed: false,
                internalType: "address",
                name: "bettor",
                type: "address",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "amount",
                type: "uint256",
            },
            {
                indexed: false,
                internalType: "bytes1",
                name: "challenges",
                type: "bytes1",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "answerBlockNumber",
                type: "uint256",
            },
        ],
        name: "REFUND",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: "uint256",
                name: "index",
                type: "uint256",
            },
            {
                indexed: false,
                internalType: "address",
                name: "bettor",
                type: "address",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "amount",
                type: "uint256",
            },
            {
                indexed: false,
                internalType: "bytes1",
                name: "challenges",
                type: "bytes1",
            },
            {
                indexed: false,
                internalType: "bytes32",
                name: "answer",
                type: "bytes32",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "answerBlockNumber",
                type: "uint256",
            },
        ],
        name: "WIN",
        type: "event",
    },
    {
        inputs: [],
        name: "answerForTest",
        outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
        stateMutability: "view",
        type: "function",
        constant: true,
    },
    {
        inputs: [],
        name: "owner",
        outputs: [
            { internalType: "address payable", name: "", type: "address" },
        ],
        stateMutability: "view",
        type: "function",
        constant: true,
    },
    {
        inputs: [],
        name: "getPot",
        outputs: [{ internalType: "uint256", name: "value", type: "uint256" }],
        stateMutability: "view",
        type: "function",
        constant: true,
    },
    {
        inputs: [
            { internalType: "bytes1", name: "challenges", type: "bytes1" },
        ],
        name: "betAndDistribute",
        outputs: [{ internalType: "bool", name: "result", type: "bool" }],
        stateMutability: "payable",
        type: "function",
        payable: true,
    },
    {
        inputs: [
            { internalType: "bytes1", name: "challenges", type: "bytes1" },
        ],
        name: "bet",
        outputs: [{ internalType: "bool", name: "result", type: "bool" }],
        stateMutability: "payable",
        type: "function",
        payable: true,
    },
    {
        inputs: [],
        name: "distribute",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [{ internalType: "bytes32", name: "answer", type: "bytes32" }],
        name: "setAnswerForTest",
        outputs: [{ internalType: "bool", name: "result", type: "bool" }],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "bytes1", name: "challenges", type: "bytes1" },
            { internalType: "bytes32", name: "answer", type: "bytes32" },
        ],
        name: "isMatch",
        outputs: [
            {
                internalType: "enum Lottery.BettingResult",
                name: "",
                type: "uint8",
            },
        ],
        stateMutability: "pure",
        type: "function",
        constant: true,
    },
    {
        inputs: [{ internalType: "uint256", name: "index", type: "uint256" }],
        name: "getBetInfo",
        outputs: [
            {
                internalType: "uint256",
                name: "answerBlockNumber",
                type: "uint256",
            },
            { internalType: "address", name: "bettor", type: "address" },
            { internalType: "bytes1", name: "challenges", type: "bytes1" },
        ],
        stateMutability: "view",
        type: "function",
        constant: true,
    },
];
const App: React.FC = () => {
    const [account, setAccount] = useState("");
    const [balance, setBalance] = useState("");
    const [contract, setContract] = useState<any>(null);

    useEffect(() => {
        if (window.ethereum) {
            const web3 = new Web3(window.ethereum);
            connectMetaMask(web3);
            loadContract(web3);
            bet(web3);
        } else {
            alert(
                "MetaMask is not installed. Please install it and try again."
            );
        }
    }, [account]);

    /**
     * @dev 사용자에게 계정 연결 권한을 요청하고
     * 연결된 address와 balance를 가져온다
     * @param web3 Web3 인스턴스
     */
    const connectMetaMask = async (web3: Web3) => {
        try {
            await window.ethereum.enable();
            const accounts = await web3.eth.getAccounts();
            const balances: string = (
                await web3.eth.getBalance(accounts[0])
            ).toString();
            setAccount(accounts[0]);
            setBalance(balances);

            // 스마트 컨트랙트 값을 변경하지 않고 값만 가져오는 : call();
            let pot = await contract.methods.getPot().call();
            console.log(pot);

            let owner = await contract.methods.owner().call();
            console.log(owner);
        } catch (error) {
            alert("User denied account access");
        }
    };

    /**
     * @dev 스마트 컨트랙트 인스턴스를 생성하고
     * 컨트랙트 정보를 저장
     * @param web3 web3 인스턴스
     */
    const loadContract = (web3: Web3) => {
        const lotteryContract = new web3.eth.Contract(
            lotteryABI,
            lotteryAddress
        );
        setContract(lotteryContract);
    };

    const bet = async (web3: Web3) => {
        // nonce: 얼마나 많은 트랜잭션을 보냈는지
        let nonce = await web3.eth.getTransactionCount(account);
        contract.methods.betAndDistribute("0xcd").send({
            from: account,
            value: 500000000000000,
            gas: 3000000,
            nonce: nonce,
        });
    };

    return (
        <div className="App">
            <header className="App-header">
                <h1>MetaMask 연동 예제</h1>
                {account ? (
                    <div>
                        <p>Wallet address: {account}</p>
                        <p>Wallet balance: {balance} ETH</p>
                    </div>
                ) : (
                    <p>지갑이 연결되지 않았습니다.</p>
                )}
            </header>
        </div>
    );
};

export default App;
