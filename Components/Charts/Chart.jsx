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
export default function Chart() {
  const [btcData, setBtcData] = useState([]);
  useEffect(() => {
    function getMarketData() {
      console.log("fetching data from binance");
      fetch(
        "https://api.binance.com/api/v3/klines?symbol=USTUSDT&interval=1m&limit=60"
      )
        .then((response) => response.json())
        .then((data) => setBtcData(data));
    }
    getMarketData();
  }, []);
  let parsedData = [];
  if (btcData) {
    parsedData = btcData.map((time) => {
      const date = new Date(time[0]);
      return {
        BTCtime: `${date.getHours()}:${date.getMinutes()}`,
        BTCprice: Number(time[1]),
      };
    });
  }
  console.log(parsedData);
  return !parsedData[0] ? null : (
    <ResponsiveContainer>
      <AreaChart data={parsedData}>
        <Area
          type="monotone"
          dataKey="BTCprice"
          stroke="#8884d8"
          fill="#8884d8"
        />
        <XAxis dataKey="BTCtime" tick={{ fill: "white", fontSize: "15" }} />
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
