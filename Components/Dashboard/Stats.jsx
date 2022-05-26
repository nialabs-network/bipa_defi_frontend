import { useState, useEffect } from "react";
import { useWeb3Context } from "../../Contexts";
import periods from "../Staking/lockPools";
import CountUp from "react-countup/";
export default function Stats({ styles, tvl }) {
  const { web3State } = useWeb3Context();
  const { web3Provider, address, contracts } = web3State;
  const [nasmgPrice, setNasmgPrice] = useState(0.0010231); //need to get quote from an exchange
  const [nasmgSupply, setNasmgSupply] = useState(500000000); //fixed supply
  return (
    <section className={`${styles.stats} ${styles.glass}`}>
      <div className={`${styles.stat} ${styles.glassMob}`}>
        <p className={styles.title}>Market Cap</p>
        <p className={styles.value}>
          $
          <CountUp end={Math.floor(nasmgPrice * nasmgSupply)} />
        </p>
      </div>
      <div className={`${styles.stat} ${styles.glassMob}`}>
        <p className={styles.title}>NASMG Price</p>
        <p className={styles.value}>
          $
          <CountUp end={nasmgPrice} decimals={6} />
        </p>
      </div>
      <div className={`${styles.stat} ${styles.glassMob}`}>
        <p className={styles.title}>APY</p>
        <p className={styles.value}>
          <CountUp end={90} />%
        </p>
      </div>
      <div className={`${styles.stat} ${styles.glassMob}`}>
        <p className={styles.title}>Total Value Locked</p>
        <p className={styles.value}>
          {address ? (
            <>
              <CountUp end={Math.trunc(tvl * 100) / 100} /> NASMG
            </>
          ) : (
            "Connect Wallet"
          )}
        </p>
      </div>
    </section>
  );
}
