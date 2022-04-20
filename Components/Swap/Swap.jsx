import styles from "./Swap.module.scss";
import Button from "../Reusables/Button";
import { useWeb3Context } from "../../Contexts";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { UniswapV2Router02 } from "../../contract/UniswapV2Router02";
import { ERC20 } from "../../contract/ERC20";
import { UniswapV2Factory } from "../../contract/UniswapV2Factory";
export default function Swap() {
  const { web3State } = useWeb3Context();
  const { address, balance, connect, web3Provider, provider } = web3State;
  const [state, setState] = useState("");
  console.log(state);
  const { t } = useTranslation();
  //////////////////////////////////////////////////////////////////////////////////////////////////////////
  ///GANACHE WETH ADDRESS = 0x32e5bEd4d487d45a3fA7233f911Ec1e0Fba2e322

  async function swap() {
    console.log("about to swap");
    const router = new web3Provider.eth.Contract(
      UniswapV2Router02,
      "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D"
    );
    const weth = new web3Provider.eth.Contract(
      ERC20,
      "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
    );
    const factory = new web3Provider.eth.Contract(
      UniswapV2Factory,
      "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f"
    );
    console.log(factory);
  }
  //////////////////////////////////////////////////////////////////////////////////////////////////////////
  return (
    <section className={`${styles.swapContainer} glass`}>
      <h2>{t("swap")}</h2>
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
