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
export default function Chart({ tvl }) {
  const { web3State } = useWeb3Context();
  const { web3Provider, contracts, address } = web3State;
  const [events, setEvents] = useState("");
  async function getEvents() {
    const blockNumber = await web3Provider.eth.getBlockNumber();
    console.log(blockNumber);
    const events = await contracts.stake.getPastEvents("allEvents", {
      fromBlock: 26472211,
      toBlock: "latest",
    });
    setEvents(events);
  }
  useEffect(() => {
    address && getEvents();
  }, [address]);
  console.log(events);

  let parsedData = [];
  if (events) {
    parsedData = events.map((event) => {
      const blockNo = event.blockNumber;
      const TVLatm = Number(
        web3Provider.utils.fromWei(event.returnValues.TVL, "ether")
      );
      return { blockNo, TVLatm };
    });
  }
  console.log(events, "events");
  console.log(parsedData, "parsed");
  return !parsedData[0] ? (
    "LOADING..."
  ) : (
    <ResponsiveContainer>
      <AreaChart data={parsedData}>
        <Area
          type="monotone"
          dataKey="TVLatm"
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
