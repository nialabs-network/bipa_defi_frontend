import React, { useEffect, useState, useRef } from "react";
import { useWeb3Context } from "../../Contexts";
import Chart from "../Charts/Chart";
import TotalTVL from "../Charts/TotalTVL";
import styles from "./Dashboard.module.scss";
import Stats from "./Stats";
import periods from "../Staking/lockPools";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
export default function Dashboard() {
  const { web3State } = useWeb3Context();
  const { address, contracts, web3Provider } = web3State;
  const [stakeTVL, setStakeTVL] = useState(0);
  const [lockTVLs, setLockTVLs] = useState(periods);
  const [events, setEvents] = useState([]);
  const [poolEvents, setPoolEvents] = useState([]);
  const [eachPoolEvents, setEachPoolEvents] = useState([]);
  const eventRef = useRef([]);
  let parsedData = [];
  let chartData = [];
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
    let eachPoolEvents = [];
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
        eachPoolEvents = eachPoolEvents.concat({ period, poolEvents });
        setEachPoolEvents(eachPoolEvents);
        setPoolEvents(poolEventsArr);
      });
  }, [address, eventRef.current.length]);

  if (eachPoolEvents.length == 4) {
    if (events.length > 0) {
      eachPoolEvents.forEach((pool) =>
        pool.poolEvents.forEach((event) => {
          parsedData.push({
            blockNumber: event.blockNumber,
            pool: pool.period,
            TVL: Number(
              web3Provider.utils.fromWei(
                event.returnValues.totalValueLocked,
                "ether"
              )
            ),
          });
        })
      );
      let parsedEvents = [];
      if (events) {
        parsedEvents = events.map((event) => {
          const blockNumber = event.blockNumber;
          const TVL = Number(
            web3Provider.utils.fromWei(event.returnValues.TVL, "ether")
          );
          return { blockNumber, TVL };
        });
      }
      parsedEvents.forEach((event) => {
        parsedData.push({
          blockNumber: event.blockNumber,
          pool: "staking",
          TVL: event.TVL,
        });
      });
      parsedData.sort((a, b) => {
        return a.blockNumber - b.blockNumber;
      });
      console.log(parsedData, "parseddata");
      parsedData.forEach((item, index) => {
        let slicedReversed = chartData.slice(0, index).reverse();
        chartData.push({
          blockNumber: item.blockNumber,
          30:
            item.pool == "30"
              ? item.TVL
              : slicedReversed.length !== 0
              ? slicedReversed[0][30]
              : 0,
          90:
            item.pool == "90"
              ? item.TVL
              : slicedReversed.length !== 0
              ? slicedReversed[0][90]
              : 0,
          180:
            item.pool == "180"
              ? item.TVL
              : slicedReversed.length !== 0
              ? slicedReversed[0][180]
              : 0,
          365:
            item.pool == "365"
              ? item.TVL
              : slicedReversed.length !== 0
              ? slicedReversed[0][365]
              : 0,
          staking:
            item.pool == "staking"
              ? item.TVL
              : slicedReversed.length !== 0
              ? slicedReversed[0]["staking"]
              : 0,
        });
      });
      console.log(chartData, "chart datta");
      // let parsedEvents = [];
      // if (events) {
      //   parsedEvents = events.map((event) => {
      //     const blockNumber = event.blockNumber;
      //     const TVL = Number(
      //       web3Provider.utils.fromWei(event.returnValues.TVL, "ether")
      //     );
      //     return { blockNumber, TVL };
      //   });
      //   console.log(parsedEvents, "ppppppppppppppppppppp");
      // }
    }
  }
  if (events)
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
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    width={500}
                    height={400}
                    data={chartData}
                    margin={{
                      top: 10,
                      right: 30,
                      left: 0,
                      bottom: 0,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="blockNumber"
                      tick={{ fill: "white", fontSize: "15" }}
                    />
                    <YAxis tick={{ fill: "white", fontSize: "15" }} />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="365"
                      stackId="1"
                      stroke="#B689C0"
                      fill="#B689C0"
                    />
                    <Area
                      type="monotone"
                      dataKey="180"
                      stackId="1"
                      stroke="#8884d8"
                      fill="#8884d8"
                    />
                    <Area
                      type="monotone"
                      dataKey="90"
                      stackId="1"
                      stroke="#82ca9d"
                      fill="#82ca9d"
                    />
                    <Area
                      type="monotone"
                      dataKey="30"
                      stackId="1"
                      stroke="#ffc658"
                      fill="#ffc658"
                    />
                    <Area
                      type="monotone"
                      dataKey="staking"
                      stackId="1"
                      stroke="#aaf6d8"
                      fill="#aaf6d8"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* <Chart tvl={lockTVLs[period].TVL} period={period} /> */}
        </section>
      </div>
    );
}
