import { useWeb3Context } from "../../Contexts";
import CountUp from "react-countup/";
export default function Stats({ styles, allPoolsTVL }) {
  const { web3State } = useWeb3Context();
  const { address } = web3State;
  const nasmgPrice = 0.0010231; //need to get quote from an exchange
  const nasmgSupply = 500000000; //fixed supply
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
