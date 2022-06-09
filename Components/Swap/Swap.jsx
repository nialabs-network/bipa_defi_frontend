import styles from "./Swap.module.scss";
import Button from "../Reusables/Button";
import { useAppContext, useWeb3Context } from "../../Contexts";
import { useTranslation } from "react-i18next";
import Image from "next/image";
import { useState, useEffect } from "react";
import { getPrice } from "./quote";
import { swap } from "./swap";
import nasmgLogo from "../../assets/nasmgLogo.webp";
import polygonLogo from "../../assets/polygonLogo.webp";
import replace from "../../assets/replace.webp";
import { fnLoader } from "../../Utils/WithDynamicLoader";
import { Fetcher, Pair, TokenAmount, WETH, Route } from "@uniswap/sdk";

export default function Swap() {
  const { web3State } = useWeb3Context();
  const { appState, dispatch, setLoadingState } = useAppContext();
  const { address, balance, connect, web3Provider, provider } = web3State;

  const tokenAddress = "0x6B175474E89094C44Da98b954EedeAC495271d0F";
  const NASMGAddress = "0xD247C2163D39263a1Ab2391Ad106c534aa3d2A48";
  const WMATICAddress = "0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270";

  useEffect(async () => {
    const DAI = await Fetcher.fetchTokenData(1, tokenAddress);
    const NASMG = await Fetcher.fetchTokenData(137, NASMGAddress); //token
    const WMATIC = await Fetcher.fetchTokenData(137, WMATICAddress); // token
    async function getPair() {
      console.log(NASMG);
      console.log(WMATIC);
      console.log(DAI);
      let pair;
      try {
        // pair = await Fetcher.fetchPairData(NASMG, WMATIC);
        pair = await Fetcher.fetchPairData(DAI, WETH[1]);
      } catch (e) {
        console.log(e);
      }
      // const pair = await Fetcher.fetchPairData(DAI, WETH[1]);
      console.log(pair);
      // const route = new Route([pair], WETH[DAI.chainId]);
      // console.log(route.midPrice.toSignificant(6)); // 201.306
    }
    await getPair();
  }, []);

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
        await swap(token0, token1.amount, address, web3Provider);
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
  function handleSwitch() {
    setToken0((prevState) => ({ ...token1, amount: "" }));
    setToken1((prevState) => ({ ...token0, amount: "" }));
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
      <Button
        value={address ? "Swap" : "Connect wallet"}
        onclick={address ? handleSwap : connect}
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
