import styles from "./Swap.module.scss";
import Button from "../Reusables/Button";
import { useAppContext, useWeb3Context } from "../../Contexts";
import { useTranslation } from "react-i18next";
import Image from "next/image";
import { useState, useEffect } from "react";
import { getPrice, swap } from "./quote";
import nasmgLogo from "../../assets/nasmgLogo.webp";
import polygonLogo from "../../assets/polygonLogo.webp";
import replace from "../../assets/replace.webp";

export default function Swap() {
  const { web3State } = useWeb3Context();
  const { setLoadingState } = useAppContext();
  const { address, balance, connect, web3Provider, contracts } = web3State;
  const [allowance, setAllowance] = useState(0);

  const [token0, setToken0] = useState({
    token: 0,
    ticker: "MATIC",
    amount: "",
    logo: polygonLogo,
  });
  const [token1, setToken1] = useState({
    token: 1,
    ticker: "NASMG",
    amount: "0",
    logo: nasmgLogo,
  });
  const { t } = useTranslation();

  async function handleSwap() {
    if (token0.amount > 0 && token0.amount !== "") {
      try {
        setLoadingState(true, "swapping");
        await swap(token0, address, web3Provider);
        setToken0((prevState) => ({ ...prevState, amount: "" }));
        setToken1((prevState) => ({ ...prevState, amount: "" }));
      } catch (e) {
        console.log(e);
      }
      setLoadingState(false, "");
    }
  }

  async function handlePriceChange(e) {
    setToken0((prevState) => ({ ...prevState, amount: e.target.value }));
    setToken1((prevState) => ({ ...prevState, amount: 0 }));
  }

  useEffect(async () => {
    if (web3Provider) {
      if (token0.amount > 0 && token0.amount !== "") {
        setLoadingState(true, "fetching price");
        const price = await getPrice(token0, web3Provider);
        setToken1((prevState) => ({ ...prevState, amount: price }));
        setLoadingState(false, "");
      }
    }
  }, [token0.amount]);

  useEffect(() => {
    if (token0.ticker == "NASMG" && address) {
      contracts.NASMG.methods
        .allowance(address, "0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff")
        .call()
        .then((res) =>
          setAllowance(Number(web3Provider.utils.fromWei(res, "ether")))
        );
    }
  }, [token0.amount]);

  function handleSwitch() {
    setToken0((prevState) => ({ ...token1, amount: "" }));
    setToken1((prevState) => ({ ...token0, amount: "" }));
  }

  async function approve() {
    try {
      setLoadingState(true, "Approving");
      const gasPrice = await web3Provider.eth.getGasPrice();
      await contracts.NASMG.methods
        .approve(
          "0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff",
          "1000000000000000000000000000000"
        )
        .send({ from: address, gasPrice });
      setLoadingState(false, "");
    } catch (e) {
      console.log(e);
      setLoadingState(false, "");
    }
  }
  //////////////////////////////////////////////////////////////////////////////////////////////////////////
  return (
    <section className={`${styles.swapContainer} glass`}>
      <p>{t("trade")}</p>
      <div className={styles.input}>
        <div className={styles.token}>
          <div className={styles.img}>
            <Image src={token0.logo} width={61} height={61} />
          </div>
          <label className={styles.label}>{token0.ticker}</label>
        </div>
        <input
          type="text"
          className={styles.formInput}
          value={token0.amount}
          onChange={handlePriceChange}
          readOnly={address ? false : true}
          placeholder="0"
        />
      </div>
      <div className={styles.switch}>
        <Image
          src={replace}
          // loader={fnLoader}
          style={{ cursor: "pointer" }}
          onClick={handleSwitch}
        />
      </div>
      <p>For (estimated)</p>
      <div className={styles.input}>
        <div className={styles.token}>
          <div className={styles.img}>
            <Image src={token1.logo} width={61} height={61} />
          </div>
          <label className={styles.label}>{token1.ticker}</label>
        </div>
        <input
          type="text"
          className={styles.formInput}
          value={token1.amount}
          readOnly
          placeholder="0"
        />
      </div>
      {console.log(token0.amount, "token amount", allowance, "allowance")}
      <Button
        value={
          token0.ticker == "MATIC"
            ? address
              ? "Swap"
              : "Connect wallet"
            : address
            ? allowance < Number(token0.amount)
              ? "Approve"
              : "Swap"
            : "Connect wallet"
        }
        onclick={
          token0.ticker == "MATIC"
            ? address
              ? handleSwap
              : connect
            : address
            ? allowance < Number(token0.amount)
              ? approve
              : handleSwap
            : connect
        }
        style={{
          width: "100%",
          height: "3.75rem",
          margin: "0 auto",
          marginTop: "4rem",
        }}
      />
    </section>
  );
}
