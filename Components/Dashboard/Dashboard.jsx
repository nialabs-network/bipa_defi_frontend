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
  const [priceFeed, setPriceFeed] = useState({});

  const tvl = Object.keys(lockTVLs)
    .map((period) => lockTVLs[period])
    .reduce((prevVal, curVal) => prevVal + curVal.TVL, 0);
  useEffect(() => {
    address && getBlockchainData();
  }, [address]);
  async function getBlockchainData() {
    //getting TOTAL VALUE LOCKED ACROSS ALL CONTRACTS
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
  }
  useEffect(async () => {
    const URL = `https://admin.ato-nc.com/api/callPrices`;
    const dataBody = {};
    const headers = {
      "Content-Type": "application/json",
      "Accept": "application/json"
    };
    let res = await ApiCaller.post(URL, dataBody, false, headers);
    res = res.data.data;
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
          time: `${date.getHours()}:${date.getMinutes()}`,
          price: (
            Number(res[point]["maticPrice"]) * Number(res[point]["nasmgPrice"])
          ).toFixed(4),
        };
      });
    feed &&
      feed.sort((a, b) => {
        return a.timestamp - b.timestamp;
      });
    console.log(res, "resPrice");
  }, []);

  useEffect(async () => {
    const URL = `https://admin.ato-nc.com/api/callEvents`;
    const headers = {
      "Content-Type": "application/json",
      "Accept": "application/json"
    };
    let res = await ApiCaller.post(URL, false, headers);
    console.log(res, "call");

    const data = res.data.data.map((event) => {
      return {
        blocknumber: event.blocknumber,
        staking: web3Provider?.utils.fromWei(
          event.staking !== "undefined" ? event.staking : "0",
          "ether"
        ),
        staking30: web3Provider?.utils.fromWei(
          event.staking30 !== "undefined" ? event.staking30 : "0",
          "ether"
        ),
        staking90: web3Provider?.utils.fromWei(
          event.staking90 !== "undefined" ? event.staking90 : "0",
          "ether"
        ),
        staking180: web3Provider?.utils.fromWei(
          event.staking180 !== "undefined" ? event.staking180 : "0",
          "ether"
        ),
        staking365: web3Provider?.utils.fromWei(
          event.staking365 !== "undefined" ? event.staking365 : "0",
          "ether"
        ),
      };
    });
    setEvents(data);
  }, [web3Provider]);

  //getting dollar value of nasmg
  const [nasmgMatic, setNasmgMatic] = useState(0);
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
              <AreaChart data={events}>
                <XAxis
                  dataKey="blocknumber"
                  tick={{ fill: "white", fontSize: "15" }}
                />
                {/* <YAxis tick={{ fill: "white", fontSize: "15" }} /> */}
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="staking365"
                  stackId="1"
                  stroke="#B689C0"
                  fill="#B689C0"
                />
                <Area
                  type="monotone"
                  dataKey="staking180"
                  stackId="1"
                  stroke="#8884d8"
                  fill="#8884d8"
                />
                <Area
                  type="monotone"
                  dataKey="staking90"
                  stackId="1"
                  stroke="#82ca9d"
                  fill="#82ca9d"
                />
                <Area
                  type="monotone"
                  dataKey="staking30"
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
