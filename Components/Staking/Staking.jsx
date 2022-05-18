import Stake from "./Stake";
import Lock from "./Lock";
import styles from "./Staking.module.scss";
import { useState } from "react";
export default function Staking() {
  const [selected, setSelected] = useState("");

  function toggle(i) {
    if (selected == i) {
      return setSelected("");
    }
    return setSelected(i);
  }

  return (
    <section className={styles.stakingContainer}>
      <div className={styles.separator}>
        <h3 className={styles.title}>STAKE</h3>
        <span className={styles.line}></span>
      </div>
      <Stake styles={styles} toggle={toggle} selected={selected} />

      <div className={styles.separator}>
        <h3 className={styles.title}>LOCK</h3>
        <span
          className={styles.line}
          style={{ borderBottom: "4px #81c9e9 solid" }}
        ></span>
      </div>
      <Lock styles={styles} toggle={toggle} selected={selected} />
    </section>
  );
}
