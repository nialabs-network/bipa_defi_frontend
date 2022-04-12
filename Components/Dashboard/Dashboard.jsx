import React from "react";
import Chart from "../Charts/Chart";
import styles from "./Dashboard.module.scss";

export default function Dashboard() {
  return (
    <div className={styles.container}>
      <section className={`${styles.stats} ${styles.glass}`}>
        <div className={styles.stat}>
          <h3 className={styles.title}>Market Cap</h3>
          <p className={styles.value}>$53,837,658</p>
        </div>
        <div className={styles.stat}>
          <h3 className={styles.title}>NASMG Price</h3>
          <p className={styles.value}>$52.90</p>
        </div>
        <div className={styles.stat}>
          <h3 className={styles.title}>wsNASMG Price</h3>
          <p className={styles.value}>$52.90</p>
        </div>
        <div className={styles.stat}>
          <h3 className={styles.title}>APY</h3>
          <p className={styles.value}>90,210.7%</p>
        </div>
        <div className={styles.stat}>
          <h3 className={styles.title}>Backing per $NASMG</h3>
          <p className={styles.value}>$30</p>
        </div>
        <div className={styles.stat}>
          <h3 className={styles.title}>Current Index</h3>
          <p className={styles.value}>25.60 NASMG</p>
        </div>
      </section>

      <section className={styles.charts}>
        <div className={`${styles.chart} ${styles.glass}`}>
          <h3>Total value locked</h3>
          <p>$35,319,355</p>
          <Chart />
        </div>
        <div className={`${styles.chart} ${styles.glass}`}>
          <h3>Total value locked</h3>
          <p>$29,460,865</p>
          <Chart />
        </div>
      </section>
    </div>
  );
}
