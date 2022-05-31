import React, { useEffect, useState, useRef } from "react";
import { useWeb3Context } from "../../Contexts";
import Chart from "../Charts/Chart";
import TotalTVL from "../Charts/TotalTVL";
import styles from "./Dashboard.module.scss";
import Stats from "./Stats";
import periods from "../Staking/lockPools";

export default function Dashboard() {
  const { web3State } = useWeb3Context();
  const { address, contracts, web3Provider } = web3State;
  const [stakeTVL, setStakeTVL] = useState(0);
  const [lockTVLs, setLockTVLs] = useState(periods);
  const [events, setEvents] = useState([]);
  const [poolEvents, setPoolEvents] = useState([]);
  const eventRef = useRef([]);
  async function getBlockchainData() {
    contracts.stake.methods
      .totalValueLocked()
      .call()
      .then((res) =>
        setStakeTVL(Number(web3Provider.utils.fromWei(res, "ether")))
      );
    Object.keys(periods).forEach((period) => {
      contracts.lock[period].methods
        .totalValueLocked()
        .call()
        .then((res) =>
          setLockTVLs((prevState) => {
            return {
              ...prevState,
              [`${period}`]: {
                ...prevState[period],
                TVL: Number(web3Provider.utils.fromWei(res, "ether")),
              },
            };
          })
        )
        .catch((e) => console.error(e));
    });

    try {
      const stakeEvents = await contracts.stake.getPastEvents("allEvents", {
        fromBlock: 26522870,
        toBlock: "latest",
      });
      eventRef.current = [...stakeEvents];
      localStorage.setItem("stakeEvents", JSON.stringify(eventRef.current));
      setEvents(eventRef.current);
    } catch (e) {
      console.log(e);
    }
  }
  useEffect(async () => {
    address && (await getBlockchainData());
  }, [address]);

  useEffect(() => {
    let poolEventsArr = [];
    console.log("pool events effect");
    address &&
      Object.keys(periods).forEach(async (period) => {
        const poolEvents = await contracts.lock[period].getPastEvents(
          "allEvents",
          {
            fromBlock: 26522870,
            toBlock: "latest",
          }
        );
        poolEventsArr = poolEventsArr.concat(poolEvents);
        localStorage.setItem("poolEvents", JSON.stringify(poolEventsArr));
        setPoolEvents(poolEventsArr);
      });
  }, [address, eventRef.current.length]);
  return (
    <div className={styles.dashboardContainer}>
      <Stats styles={styles} tvl={stakeTVL} />
      <section className={styles.charts}>
        <div className={`${styles.chart} glass`} style={{ border: "none" }}>
          <h3>Total value locked</h3>
          <p>$35,319,355</p>
          <div className={styles.chartContainer}>
            {typeof window === "undefined" ? null : (
              <TotalTVL events={events} poolEvents={poolEvents} />
            )}
          </div>
        </div>
        <div className={`${styles.chart} glass`} style={{ border: "none" }}>
          <h3>TVL (Flexible)</h3>
          <p>{stakeTVL} NASMG</p>

          <div className={styles.chartContainer}>
            {typeof window === "undefined" ? null : (
              <Chart tvl={stakeTVL} period="stake" />
            )}
          </div>
        </div>
        {Object.keys(periods).map((period) => {
          return (
            <div
              className={`${styles.chart} glass`}
              style={{ border: "none" }}
              key={period}
            >
              <h3>TVL ({period} days)</h3>
              <p>{lockTVLs[period].TVL} NASMG</p>

              <div className={styles.chartContainer}>
                {typeof window === "undefined" ? null : (
                  <Chart
                    tvl={lockTVLs[period].TVL}
                    period={period}
                    color={periods[period].color}
                  />
                )}
              </div>
            </div>
          );
        })}
        {/* <Chart tvl={lockTVLs[period].TVL} period={period} /> */}
      </section>
    </div>
  );
}
