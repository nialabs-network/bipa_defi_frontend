import styles from "./Hourglass.module.scss";
import Button from "../Reusables/Button";
import { useWeb3Context } from "../../Contexts";
export default function Hourglass() {
  const { web3State } = useWeb3Context();
  const { address, connect } = web3State;
  return (
    <section className={`${styles.container} glass`}>
      <h2>Estimate Your Returns</h2>
      <div className={styles.estimated}>
        <div className={styles.price}>
          <h3>Current NAMSG Price</h3>
          <p>$54</p>
        </div>
        <div className={styles.yeild}>
          <h3>Current NAMSG Price</h3>
          <p>$54</p>
        </div>
        <div className={styles.balance}>
          <h3>Current NAMSG Price</h3>
          <p>$54</p>
        </div>
      </div>
      <Button
        value={address ? "Do something" : "Connect wallet"}
        onclick={address ? null : connect}
        style={{ width: "100%", margin: "0 auto", marginTop: "2rem" }}
      />
    </section>
  );
}
