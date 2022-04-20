import Regular from "./Regular";
import Boost from "./Boost";
import styles from "./Staking.module.scss";
export default function Staking() {
  return (
    <section className={styles.stakingContainer}>
      <Regular styles={styles} />
      <Boost styles={styles} />
    </section>
  );
}
