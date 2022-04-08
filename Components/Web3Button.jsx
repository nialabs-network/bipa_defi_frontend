import React from "react";
import { useWeb3Context } from "../Contexts";

const ConnectButton = ({ connect }) => {
  const isReconnected = false;
  return connect ? (
    <button
      onClick={() => {
        console.log("connect click");
        connect(isReconnected);
      }}
    >
      Connect
    </button>
  ) : (
    <button>Loading...</button>
  );
};
const DisconnectButton = ({ disconnect }) => {
  return disconnect ? (
    <button onClick={disconnect}>Disconnect</button>
  ) : (
    <button>Loading...</button>
  );
};

export function Web3Button() {
  console.log("_______________button__________________");
  const { web3State } = useWeb3Context();
  // console.log(web3State, "web3state");
  const { web3Provider, connect, disconnect } = web3State;
  return web3Provider ? (
    <DisconnectButton disconnect={disconnect} />
  ) : (
    <ConnectButton connect={connect} />
  );
}
