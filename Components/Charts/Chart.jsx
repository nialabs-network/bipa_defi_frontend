import styles from "./Chart.module.scss";
import { useState } from "react";
import {
  AreaChart,
  Area,
  Tooltip,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";
import { useEffect } from "react";
import { useWeb3Context } from "../../Contexts";
export default function Chart({ events }) {
  const { web3State } = useWeb3Context();
  const { web3Provider } = web3State;
  // const [btcData, setBtcData] = useState([]);
  // useEffect(() => {
  //   function getMarketData() {
  //     console.log("fetching data from binance");
  //     fetch(
  //       "https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=1m&limit=60"
  //     )
  //       .then((response) => response.json())
  //       .then((data) => setBtcData(data));
  //   }
  //   getMarketData();
  // }, []);
  // let parsedData = [];
  // if (btcData) {
  //   parsedData = btcData.map((time) => {
  //     const date = new Date(time[0]);
  //     return {
  //       BTCtime: `${date.getHours()}:${date.getMinutes()}`,
  //       BTCprice: Number(time[1]),
  //     };
  //   });
  // }
  // console.log(parsedData);
  let parsedData = [];
  // console.log(events, "events");
  // if (events) {
  //   parsedData = events.map((event) => {
  //     const blockNo = event.blockNumber;
  //     const amount = Number(
  //       web3Provider.utils.fromWei(event.returnValues[1], "ether")
  //     );
  //     const type = event.event;
  //     return { blockNo, amount, type };
  //   });
  // }
  return !parsedData[0] ? null : (
    <ResponsiveContainer>
      <AreaChart data={parsedData}>
        <Area
          type="monotone"
          dataKey="amount"
          stroke="#8884d8"
          fill="#8884d8"
        />
        <XAxis dataKey="blockNo" tick={{ fill: "white", fontSize: "15" }} />
        <YAxis
          type="number"
          domain={["auto", "auto"]}
          tick={{ fill: "white", fontSize: "15" }}
        />
        <Tooltip></Tooltip>
      </AreaChart>
    </ResponsiveContainer>
  );
}
