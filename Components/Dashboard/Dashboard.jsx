import React, { useState, useEffect, useRef } from "react";
import { useWeb3Context } from "../../Contexts";
import TotalTVL from "../Charts/TotalTVL";
import styles from "./Dashboard.module.scss";
import Stats from "./Stats";
import periods from "../Staking/lockPools";
import { getPrice, getMaticPrice } from "../Swap/quote";
import { ApiCaller } from "./apiCaller";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
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
  const [priceFeed, setPriceFeed] = useState({});
  const eventRef = useRef([]);

  let parsedData = [];
  let chartData = [];

  const tvl = Object.keys(lockTVLs)
    .map((period) => lockTVLs[period])
    .reduce((prevVal, curVal) => prevVal + curVal.TVL, 0);
  useEffect(() => {
    address && getBlockchainData();
  }, [address]);
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
    const URL = `https://admin.ato-nc.com/api/callPrices`;
    const dataBody = {};
    const headers = {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      Accept: "application/json",
    };
    let res = await ApiCaller.post(URL, dataBody, false, headers);
    console.log(JSON.stringify(res.data.data));
    // const res = JSON.parse(
    //   `{"1":{"maticPrice":"0.482855","nasmgPrice":"1.46716","timestamp":"1656549727172"},"2":{"maticPrice":"0.482855","nasmgPrice":"1.46716","timestamp":"1656549730172"},"3":{"maticPrice":"0.482855","nasmgPrice":"1.46716","timestamp":"1656549724172"},"4":{"maticPrice":"0.482835","nasmgPrice":"1.46716","timestamp":"1656549721172"},"5":{"maticPrice":"0.482833","nasmgPrice":"1.46716","timestamp":"1656549718171"},"6":{"maticPrice":"0.482833","nasmgPrice":"1.46716","timestamp":"1656549715170"},"7":{"maticPrice":"0.482842","nasmgPrice":"1.46716","timestamp":"1656549712169"},"8":{"maticPrice":"0.482838","nasmgPrice":"1.46716","timestamp":"1656549709169"}}`
    // );
    res = res.data.data;
    console.log(res, "response");
    const feed =
      res &&
      Object.keys(res).map((point) => {
        const date = new Date(Number(res[point]["timestamp"]));
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
          timestamp: Number(res[point]["timestamp"]),
          time: `${date.getFullYear()}/${
            date.getMonth() + 1
          }/${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`,
          price: (
            Number(res[point]["maticPrice"]) * Number(res[point]["nasmgPrice"])
          ).toFixed(4),
        };
      });
    console.log(
      feed &&
        feed.sort((a, b) => {
          return a.timestamp - b.timestamp;
        }),
      "feed"
    );
    setPriceFeed(feed);
    localStorage.setItem("priceFeed", JSON.stringify(feed));

    // .then((res) => {
    //   const feed = res.data.poolDayDatas.map((item) => {
    //     return {
    //       time: `${date.getDate()} ${months[date.getMonth()]}`,
    //       price: item.token0Price.slice(0, item.token0Price.indexOf(".")),
    //     };
    //   });
    //   console.log(feed, 'feed')
    //   setPriceFeed(feed);
    //   localStorage.setItem("priceFeed", JSON.stringify(feed));
    // });
  }, []);
  // console.log(events);
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
  // console.log(parsedData, "parsed data  ");
  // console.log(chartData, "chartdata");
  const [nasmgMatic, setNasmgMatic] = useState(0); //need to get quote from an exchange
  const [maticPrice, setMaticPrice] = useState(0);
  useEffect(async () => {
    const price =
      web3Provider &&
      (await getPrice({ ticker: "NASMG", amount: "1" }, web3Provider));
    const matic = web3Provider && (await getMaticPrice(web3Provider));
    setMaticPrice(matic);
    setNasmgMatic(price);
  }, [web3Provider]);
  return (
    <div className={styles.dashboardContainer}>
      <Stats
        styles={styles}
        allPoolsTVL={stakeTVL + tvl}
        price={nasmgMatic ? Number(nasmgMatic) * Number(maticPrice) : 0}
      />
      <section className={styles.charts}>
        <div className={`${styles.chart} glass`} style={{ border: "none" }}>
          <h3>NASMG price</h3>
          <p>
            $
            {nasmgMatic
              ? (Number(nasmgMatic) * Number(maticPrice)).toFixed(4)
              : 0}
          </p>
          <div className={styles.chartContainer}>
            <TotalTVL priceFeed={priceFeed} />
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
