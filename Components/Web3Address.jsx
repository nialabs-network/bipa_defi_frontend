import React from "react";
import { useTranslation } from "react-i18next";
import { useWeb3Context, useAppContext } from "../Contexts";
const NETWORKS = {
  1: "Ethereum Main Network (Mainnet)",
  3: "Ropsten Test Network",
  4: "Rinkeby Test Network",
  5: "Goerli Test Network",
  42: "Kovan Test Network",
  137: "Polygon Mainnet",
  80001: "Mumbai Test Network",
  5777: "Ganache Network",
};
export function Web3Address() {
  console.log("____________Address__________________");
  const { t } = useTranslation();

  const { web3State } = useWeb3Context();
  // console.log(web3State, "web3 state");

  return (
    <div>
      <h1>
        {t("address")}:{" "}
        {web3State.address
          ? web3State.address
          : "0x000000000000000000000000000000000"}
      </h1>
      <h1>
        {t("network")}: {NETWORKS[web3State.network]}
      </h1>
      <h1>
        {t("network")} ID: {web3State.network}
      </h1>
      <h1>
        {t("balance")}:{" "}
        {web3State.balance
          ? web3State.web3Provider.utils.fromWei(web3State.balance, "ether")
          : null}{" "}
        ETH
      </h1>
    </div>
  );
}
