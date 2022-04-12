import styles from "./Chart.module.scss";
import { useState } from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";
import { UserData } from "./ChartsData";
export default function Chart() {
  const [userData, setUserData] = useState({
    type: "line",
    labels: UserData.map((data) => data.year),
    datasets: [
      {
        label: "users",
        data: UserData.map((data) => data.userGain),
        fill: true,
      },
      {
        label: "register",
        data: UserData.map((data) => data.userGain - Math.random() * 10000),
        fill: true,
      },
      {
        label: "hia",
        data: UserData.map((data) => data.userGain - Math.random() * 50000),
        fill: true,
      },
    ],
  });
  return (
    <div className={styles.container}>
      <Line data={userData} options={{}} />
      chart
    </div>
  );
}
