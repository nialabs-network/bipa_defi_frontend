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
  const [binanceData, setBinanceData] = useState([]);
  useEffect(() => {
    console.log("fetching data from binance");
    fetch(
      "https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=6h&limit=30"
    )
      .then((response) => response.json())
      .then((data) => setBinanceData(data));
  }, []);
  let parsedData = [];
  if (binanceData) {
    parsedData = binanceData.map((hour) => {
      const date = new Date(hour[0]);
      return {
        time: `${date.getHours()}:${date.getMinutes()}`,
        price: Number(hour[1]),
      };
    });
  }
  console.log(parsedData);
  return (
    <ResponsiveContainer width="100%" heihgt="100%">
      <AreaChart data={parsedData}>
        <Area type="monotone" dataKey="price" stroke="#ffffff" />
        <XAxis dataKey="time" />
        <YAxis type="number" domain={["auto", "auto"]} />
        <Tooltip />
      </AreaChart>
    </ResponsiveContainer>
  );
}
