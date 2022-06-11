import { useWeb3Context } from "../../Contexts";
import { useState, useEffect } from "react";
import CountUp from "react-countup/";
import { getPrice, getMaticPrice } from "../Swap/quote";
export default function Stats({ styles, allPoolsTVL }) {
  const { web3State } = useWeb3Context();
  const { web3Provider, address } = web3State;
  const token = { ticker: "NASMG", amount: "1" };
  const [nasmgMatic, setNasmgMatic] = useState(0); //need to get quote from an exchange
  const [maticPrice, setMaticPrice] = useState(0);
  const nasmgSupply = 500000000; //fixed supply
  useEffect(async () => {
    const price = web3Provider && (await getPrice(token, web3Provider));
    const matic = web3Provider && (await getMaticPrice(web3Provider));
    setMaticPrice(matic);
    setNasmgMatic(price);
  }, [web3Provider]);
  return (
    <section className={`${styles.stats} ${styles.glass}`}>
      <div className={`${styles.stat} ${styles.glassMob}`}>
        <p className={styles.title}>Market Cap</p>
        <p className={styles.value}>
          $
          {nasmgMatic ? (
            <CountUp end={Math.floor(nasmgMatic * nasmgSupply)} />
          ) : (
            "fetching..."
          )}
        </p>
      </div>
      <div className={`${styles.stat} ${styles.glassMob}`}>
        <p className={styles.title}>NASMG Price</p>
        <p className={styles.value}>
          $
          {nasmgMatic ? (
            <CountUp
              end={Number(nasmgMatic) * Number(maticPrice)}
              decimals={6}
            />
          ) : (
            "fetching..."
          )}
        </p>
      </div>
      <div className={`${styles.stat} ${styles.glassMob}`}>
        <p className={styles.title}>APR</p>
        <p className={styles.value}>
          <CountUp end={100} />%
        </p>
      </div>
      <div className={`${styles.stat} ${styles.glassMob}`}>
        <p className={styles.title}>Total Value Locked</p>
        <p className={styles.value}>
          {address ? (
            <>
              <CountUp end={Math.trunc(allPoolsTVL * 100) / 100} /> NASMG
            </>
          ) : (
            "Connect Wallet"
          )}
        </p>
      </div>
    </section>
  );
}
