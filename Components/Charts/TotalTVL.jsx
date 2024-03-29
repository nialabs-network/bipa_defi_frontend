import React from "react";
import {
  AreaChart,
  Area,
  Tooltip,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";
import { useWeb3Context } from "../../Contexts";
export default function TotalTVL({ priceFeed }) {
  // if (typeof localStorage !== "undefined") {
  //   events = localStorage.getItem("stakeEvents")
  //     ? JSON.parse(localStorage.getItem("stakeEvents"))
  //     : events;
  //   events = localStorage.getItem("poolEvents")
  //     ? events.concat(JSON.parse(localStorage.getItem("poolEvents")))
  //     : events.concat(poolEvents);
  // } else {
  //   events = events.concat(poolEvents);
  // }
  // events.sort((a, b) => {
  //   return a.blockNumber - b.blockNumber;
  // });
  // const { web3State } = useWeb3Context();
  // const { web3Provider, contracts, address } = web3State;
  // let parsedData = [];
  // if (events) {
  //   let total = 0;
  //   for (let i = 0; i < events.length; i++) {
  //     if (events[i].event === "Deposit") {
  //       total =
  //         total +
  //         Number(
  //           events[i].returnValues.amount
  //             ? web3Provider?.utils.fromWei(
  //                 events[i].returnValues.amount,
  //                 "ether"
  //               )
  //             : web3Provider?.utils.fromWei(
  //                 events[i].returnValues.amount,
  //                 "ether"
  //               )
  //         );
  //     }
  //     if (events[i].event === "Withdraw") {
  //       total =
  //         total -
  //         Number(
  //           events[i].returnValues.amount
  //             ? web3Provider?.utils.fromWei(
  //                 events[i].returnValues.amount,
  //                 "ether"
  //               )
  //             : web3Provider.utils.fromWei(
  //                 events[i].returnValues.amount,
  //                 "ether"
  //               )
  //         );
  //     }
  //     parsedData.unshift({
  //       blockNumber: events[i].blockNumber,
  //       TVLatm: total,
  //     });
  //   }
  //   // parsedData = events.map((event) => {
  //   //   const blockNo = event.blockNumber;
  //   //   const TVLatm = Number(
  //   //     event.returnValues.totalValueLocked
  //   //       ? web3Provider.utils.fromWei(
  //   //           event.returnValues.totalValueLocked,
  //   //           "ether"
  //   //         )
  //   //       : web3Provider.utils.fromWei(event.returnValues.TVL, "ether")
  //   //   );
  //   //   return { blockNo, TVLatm };
  //   // });
  // }
  // parsedData.reverse();

  return (
    <ResponsiveContainer>
      <AreaChart data={priceFeed}>
        <Area type="monotone" dataKey="price" stroke="#8884d8" fill="#8884d8" />
        <XAxis dataKey="time" tick={{ fill: "white", fontSize: "15" }} />
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
