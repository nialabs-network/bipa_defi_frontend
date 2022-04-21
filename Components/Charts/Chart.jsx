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
    console.log("fetching data from binance");
    fetch(
      "https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=1m&limit=60"
    )
      .then((response) => response.json())
      .then((data) => setBtcData(data));
  }, []);
  let parsedData = [];
  if (btcData) {
    parsedData = btcData.map((hour) => {
      const date = new Date(hour[0]);
      return {
        BTCtime: `${date.getHours()}:${date.getMinutes()}`,
        BTCprice: Number(hour[1]),
      };
    });
  }
  console.log(parsedData);
  return !parsedData[0] ? null : (
    <ResponsiveContainer width="100%" heihgt="80%">
      <AreaChart data={parsedData} ref={console.log("injecting chart")}>
        <Area type="monotone" dataKey="BTCprice" stroke="#ffffff" />
        <XAxis dataKey="BTCtime" />
        <YAxis type="number" domain={["auto", "auto"]} />
        <Tooltip />
      </AreaChart>
    </ResponsiveContainer>
  );
}
