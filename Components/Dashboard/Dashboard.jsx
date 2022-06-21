import React, { useEffect, useState, useRef } from "react";
import { useWeb3Context } from "../../Contexts";
import TotalTVL from "../Charts/TotalTVL";
import styles from "./Dashboard.module.scss";
import Stats from "./Stats";
import periods from "../Staking/lockPools";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { ApolloClient, InMemoryCache, gql } from "@apollo/client";
export default function Dashboard() {
  const { web3State } = useWeb3Context();
  const { address, contracts, web3Provider } = web3State;
  const [stakeTVL, setStakeTVL] = useState(0);
  const [lockTVLs, setLockTVLs] = useState(periods);
  const [events, setEvents] = useState([]);
  const [poolEvents, setPoolEvents] = useState([]);
  const [eachPoolEvents, setEachPoolEvents] = useState([]);
  const [priceFeed, setPriceFeed] = useState({});
  const eventRef = useRef([]);

  let parsedData = [];
  let chartData = [];

  const tvl = Object.keys(lockTVLs)
    .map((period) => lockTVLs[period])
    .reduce((prevVal, curVal) => prevVal + curVal.TVL, 0);

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
      const currentBlock = await web3Provider.eth.getBlockNumber();
      const stakeEvents = await contracts.stake.getPastEvents("allEvents", {
        fromBlock: currentBlock - 9000,
        toBlock: "latest",
      });
      console.log(stakeEvents, "stake events");
      eventRef.current = [...stakeEvents];
      localStorage.setItem("stakeEvents", JSON.stringify(eventRef.current));
      setEvents(eventRef.current);
    } catch (e) {
      console.log(e);
    }
  }
  useEffect(async () => {
    address && (await getBlockchainData());
    const client = new ApolloClient({
      uri: "https://api.thegraph.com/subgraphs/name/ianlapham/uniswap-v3-polygon",
      cache: new InMemoryCache(),
    });
    client
      .query({
        query: gql`
          {
            poolDayDatas(
              first: 30
              orderBy: date
              where: {
                pool: "0x45dda9cb7c25131df268515131f647d726f50608"
                date_gt: ${
                  Math.round(new Date().getTime() / 1000) - 30 * 24 * 60 * 60
                }
              }
            ) {
              date
              token0Price
              token1Price
            }
          }
        `,
      })
      .then((res) => {
        const feed = res.data.poolDayDatas.map((item) => {
          const date = new Date(item.date * 1000);
          var months = [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
          ];
          return {
            time: `${date.getDate()} ${months[date.getMonth()]}`,
            price: item.token0Price.slice(0, item.token0Price.indexOf(".")),
          };
        });
        setPriceFeed(feed);
        localStorage.setItem("priceFeed", JSON.stringify(feed));
      });
  }, [address]);
  console.log(events);
  useEffect(() => {
    let poolEventsArr = [];
    let eachPoolEvents = [];
    address &&
      Object.keys(periods).forEach(async (period) => {
        const currentBlock = await web3Provider.eth.getBlockNumber();
        const poolEvents = await contracts.lock[period].getPastEvents(
          "allEvents",
          {
            fromBlock: currentBlock - 9000,
            toBlock: "latest",
          }
        );
        console.log(poolEvents, period);
        poolEventsArr = poolEventsArr.concat(poolEvents);
        localStorage.setItem("poolEvents", JSON.stringify(poolEventsArr));
        eachPoolEvents = eachPoolEvents.concat({ period, poolEvents });
        setEachPoolEvents(eachPoolEvents);
        setPoolEvents(poolEventsArr);
      });
  }, [address, eventRef.current.length]);

  //
  if (eachPoolEvents.length == 4) {
    if (events.length > 0) {
      eachPoolEvents.forEach((pool) =>
        pool.poolEvents.forEach((event) => {
          parsedData.push({
            blockNumber: event.blockNumber,
            pool: pool.period,
            TVL: Number(
              web3Provider?.utils.fromWei(
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
            web3Provider?.utils.fromWei(event.returnValues.TVL, "ether")
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
    }
  }
  console.log(parsedData, "parsed data  ");
  console.log(chartData, "chartdata");
  if (events)
    return (
      <div className={styles.dashboardContainer}>
        <Stats styles={styles} allPoolsTVL={stakeTVL + tvl} />
        <section className={styles.charts}>
          <div className={`${styles.chart} glass`} style={{ border: "none" }}>
            <h3>Test chart</h3>
            <p>
              $
              {priceFeed.length > 0
                ? priceFeed[priceFeed.length - 1].price
                : null}
            </p>
            <div className={styles.chartContainer}>
              <TotalTVL
                priceFeed={
                  typeof localStorage !== "undefined"
                    ? JSON.parse(localStorage.getItem("priceFeed"))
                    : priceFeed
                }
              />
            </div>
          </div>
          <div className={`${styles.chart} glass`} style={{ border: "none" }}>
            <h3>TVL (Flexible)</h3>
            <p>{stakeTVL + tvl} </p>

            <div className={styles.chartContainer}>
              <ResponsiveContainer>
                <AreaChart data={chartData}>
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
            </div>
          </div>
        </section>
      </div>
    );
}
