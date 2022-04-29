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
    <ResponsiveContainer>
      <AreaChart data={parsedData}>
        <defs>
          <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
          </linearGradient>
        </defs>
        <Area
          type="monotone"
          dataKey="BTCprice"
          stroke="#ffffff"
          fill="url(#colorUv)"
        />
        <XAxis dataKey="BTCtime" />
        <YAxis type="number" domain={["auto", "auto"]} />
        <Tooltip />
      </AreaChart>
    </ResponsiveContainer>
  );
}
