import React from "react";
import styles from "./Dashboard.module.scss";

export default function Dashboard() {
  return (
    <div className={styles.container}>
      <section className={styles.stats}>
        <div className={styles.item}>
          <h3>Market Cap</h3>
          <p>$53,837,658</p>
        </div>
        <div className={styles.item}>
          <h3>NASMG Price</h3>
          <p>$52.90</p>
        </div>
        <div className={styles.item}>
          <h3>wsNASMG Price</h3>
          <p>$52.90</p>
        </div>
        <div className={styles.item}>
          <h3>APY</h3>
          <p>90,210.7%</p>
        </div>
        <div className={styles.item}>
          <h3>Backing per $NASMG</h3>
          <p>$30</p>
        </div>
        <div className={styles.item}>
          <h3>Current Index</h3>
          <p>25.60 NASMG</p>
        </div>
      </section>
      <section className={styles.graphs}>
        <div className={styles.left}>
          <h3>Total value locked</h3>
          <p>$35,319,355</p>
        </div>
        <div className={styles.right}>
          <h3>Total value locked</h3>
          <p>$29,460,865</p>
        </div>
      </section>
    </div>
  );
}
