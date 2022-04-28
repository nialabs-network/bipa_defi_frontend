import React from "react";
import Chart from "../Charts/Chart";
import styles from "./Dashboard.module.scss";
import Stats from "./Stats";

export default function Dashboard() {
  return (
    <div className={styles.dashboardContainer}>
      <Stats styles={styles} />
      <section className={styles.charts}>
        <div className={`${styles.chart} glass`} style={{ border: "none" }}>
          <h3>Total value locked</h3>
          <p>$35,319,355</p>
          <div className={styles.chartContainer}>
            {typeof window === "undefined" ? null : <Chart />}
          </div>
        </div>
        <div className={`${styles.chart} glass`} style={{ border: "none" }}>
          <h3>Total value locked</h3>
          <p>$29,460,865</p>
          <div className={styles.chartContainer}>
            {typeof window === "undefined" ? null : <Chart />}
          </div>
        </div>
      </section>
    </div>
  );
}
