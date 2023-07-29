import React, { useState, useEffect } from "react";
import Web3 from "web3";

const App: React.FC = () => {
    const [account, setAccount] = useState("");
    const [balance, setBalance] = useState("");

    useEffect(() => {
        if (window.ethereum) {
            const web3 = new Web3(window.ethereum);
            connectMetaMask(web3);
        } else {
            alert(
                "MetaMask is not installed. Please install it and try again."
            );
        }
    }, []);

    const connectMetaMask = async (web3: Web3) => {
        try {
            await window.ethereum.enable();
            const accounts = await web3.eth.getAccounts();
            const balances: string = (
                await web3.eth.getBalance(accounts[0])
            ).toString();
            setAccount(accounts[0]);
            setBalance(balances);
        } catch (error) {
            alert("User denied account access");
        }
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
