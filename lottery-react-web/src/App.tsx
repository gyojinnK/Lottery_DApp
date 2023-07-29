import React from "react";
import "./App.css";
import { useEtherBalance, useEthers } from "@usedapp/core";
import { formatEther } from "@ethersproject/units";

const App = () => {
    const { activateBrowserWallet, deactivate, account } = useEthers();
    const etherBalance = useEtherBalance(account);

    return (
        <div className="App">
            <header className="App-header">
                {account && `Account: ${account}`}
                <br />
                {etherBalance &&
                    `Balance: ${Number(formatEther(etherBalance)).toFixed(
                        4
                    )} ETH`}
                <p className="App-link">
                    {account ? (
                        <code onClick={deactivate}>LogOut</code>
                    ) : (
                        <code onClick={() => activateBrowserWallet()}>
                            Connect Wallet
                        </code>
                    )}
                </p>
            </header>
        </div>
    );
};
export default App;
