import styles from "./Hourglass.module.scss";
import Button from "../Reusables/Button";
import { useWeb3Context } from "../../Contexts";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
export default function Hourglass() {
  const { web3State } = useWeb3Context();
  const { address, connect } = web3State;
  return (
    <section className={`${styles.container} glass`}>
      <h2 className={styles.pageTitle}>Estimate Your Returns</h2>
      <div className={styles.estimated}>
        <div className={styles.price}>
          <h3 className={styles.title}>Current NAMSG Price</h3>
          <p className={styles.value}>$54</p>
        </div>
        <div className={styles.yeild}>
          <h3 className={styles.title}>Current NAMSG Price</h3>
          <p className={styles.value}>$54</p>
        </div>
        <div className={styles.balance}>
          <h3 className={styles.title}>Current NAMSG Price</h3>
          <p className={styles.value}>$54</p>
        </div>
      </div>
      {!address ? (
        <Button
          value="Connect wallet"
          onclick={address ? null : connect}
          style={{ width: "15rem", margin: "1rem auto 1.5rem auto" }}
        />
      ) : (
        <div className={styles.estimateContrainer}>
          <div className={styles.inputContainer}>
            <div className={styles.input}>
              <p className={styles.label}>NASMG Amount</p>
              <input type="number" className={styles.formInput} />
            </div>
            <div className={styles.input}>
              <p className={styles.label}>Reward Yield(%)</p>
              <input type="number" className={styles.formInput} />
            </div>
            <div className={styles.input}>
              <p className={styles.label}>NASMG Purchase Price($)</p>
              <input type="number" className={styles.formInput} />
            </div>
            <div className={styles.input}>
              <p className={styles.label}>Future NASMG Market Price</p>
              <input type="number" className={styles.formInput} />
            </div>
          </div>
          <Slider />
        </div>
      )}
    </section>
  );
}
