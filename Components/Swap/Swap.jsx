import styles from "./Swap.module.scss";
import Button from "../Reusables/Button";
import { useWeb3Context } from "../../Contexts";
import { useTranslation } from "react-i18next";
import { useState } from "react";

import { SwapWidget } from "@uniswap/widgets";
import "@uniswap/widgets/fonts.css";

////////////////////////////////////////////////////////////\
import { Pool } from "@uniswap/v3-sdk";
////////////////////////////////////////////////////////////
export default function Swap() {
  const { web3State } = useWeb3Context();
  const { address, balance, connect, web3Provider, provider } = web3State;
  const [state, setState] = useState("");
  console.log(state);
  const { t } = useTranslation();
  //////////////////////////////////////////////////////////////////////////////////////////////////////////
  ///GANACHE WETH ADDRESS = 0x32e5bEd4d487d45a3fA7233f911Ec1e0Fba2e322
  async function swap() {
    console.log();
  }
  //////////////////////////////////////////////////////////////////////////////////////////////////////////
  return (
    <section className={`${styles.swapContainer} glass`}>
      <h2>{t("swap")}</h2>
      {/* {address ? (
        <SwapWidget
          provider={web3Provider.currentProvider}
          jsonRpcEndpoint={provider}
        />
      ) : null} */}

      <div className={styles.input}>
        <div className={styles.token}>MATIC</div>
        <input
          type="text"
          className={styles.formInput}
          value={state}
          onChange={(e) => {
            setState(e.target.value);
          }}
        />
      </div>
      <div className={styles.input}>
        <div className={styles.token}>NASMG</div>
        <input type="text" className={styles.formInput} />
      </div>
      <Button
        value={address ? "Swap" : "Connect wallet"}
        onclick={address ? swap : connect}
        style={{
          width: "100%",
          margin: "0 auto",
          marginTop: "2rem",
        }}
      />
    </section>
  );
}
