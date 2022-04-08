import React from "react";
import { Web3Button, Web3Address } from "../Components";
import Dashboard from "../Components/Dashboard/Dashboard";
import Stateless from "../Components/stateless";
export default function Home() {
  console.log("___________index.js____________");
  return (
    <>
      {/* <Web3Address />
      <Web3Button />
      <Stateless /> */}
      <Dashboard />
    </>
  );
}
