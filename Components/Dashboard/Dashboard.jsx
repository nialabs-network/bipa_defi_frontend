import React, { useEffect, useState } from "react";
import { useWeb3Context } from "../../Contexts";
import Chart from "../Charts/Chart";
import styles from "./Dashboard.module.scss";
import Stats from "./Stats";
import periods from "../Staking/lockPools";

export default function Dashboard() {
  const { web3State } = useWeb3Context();
  const { address, contracts, web3Provider } = web3State;
  const [TVL, setTVL] = useState(0);

  async function getBlockchainData() {
    const flexibleStakingTVL = await contracts.stake.methods
      .totalValueLocked()
      .call();
    setTVL(Number(web3Provider.utils.fromWei(flexibleStakingTVL, "ether")));
    // Object.keys(periods).forEach((key) => {
    //   contracts.lock[key].methods
    //     .totalValueLocked()
    //     .call()
    //     .then((res) =>
    //       setTVL(
    //         (prevState) =>
    //           prevState + Number(web3Provider.utils.fromWei(res, "ether"))
    //       )
    //     );
    // });
  }
  useEffect(async () => {
    address && (await getBlockchainData());
  }, [address]);

  return (
    <div className={styles.dashboardContainer}>
      <Stats styles={styles} tvl={TVL} />
      <section className={styles.charts}>
        <div className={`${styles.chart} glass`} style={{ border: "none" }}>
          <h3>Total value locked</h3>
          <p>$35,319,355</p>
          <div className={styles.chartContainer}>
            {/* {typeof window === "undefined" ? null : <Chart />} */}
          </div>
        </div>
        <div className={`${styles.chart} glass`} style={{ border: "none" }}>
          <h3>Total value locked</h3>
          <p>$29,460,865</p>
          <div className={styles.chartContainer}>
            {typeof window === "undefined" ? null : <Chart tvl={TVL} />}
          </div>
        </div>
      </section>
    </div>
  );
}
