import styles from "./Swap.module.scss";
import Button from "../Reusables/Button";
import { useAppContext, useWeb3Context } from "../../Contexts";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import { APP_ACTIONS } from "../../Reducers";
import { getPrice } from "./quote";

export default function Swap() {
  const { web3State } = useWeb3Context();
  const { appState, dispatch } = useAppContext();
  const { address, balance, connect, web3Provider, provider } = web3State;
  const [maticAmount, setMaticAmount] = useState("");
  const [nasmgAmount, setNasmgAmount] = useState("");
  const { t } = useTranslation();
  //////////////////////////////////////////////////////////////////////////////////////////////////////////

  async function handleSwap() {
    dispatch({
      type: APP_ACTIONS.SET_LOADING,
      loading: true,
      loading_msg: "swapping",
    });
    dispatch({
      type: APP_ACTIONS.SET_LOADING,
      loading: false,
      loading_msg: "",
    });
  }
  function handlePrice() {
    if (maticAmount !== "") getPrice(maticAmount, web3Provider);
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
          value={maticAmount}
          onChange={(e) => {
            setMaticAmount(e.target.value);
          }}
        />
      </div>
      <div className={styles.input}>
        <div className={styles.token}>NASMG</div>
        <input
          type="text"
          className={styles.formInput}
          value={nasmgAmount}
          readOnly
        />
      </div>
      <Button
        value={address ? "Get Price" : "Connect wallet"}
        onclick={address ? handlePrice : connect}
        style={{
          width: "100%",
          margin: "0 auto",
          marginTop: "2rem",
        }}
      />
      <Button
        value={address ? "Swap" : "Connect wallet"}
        onclick={address ? handleSwap : connect}
        style={{
          width: "100%",
          margin: "0 auto",
          marginTop: "2rem",
        }}
      />
    </section>
  );
}
