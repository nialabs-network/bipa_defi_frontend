import Head from "next/head";
import React from "react";
import Dashboard from "../Components/Dashboard/Dashboard";
export default function Home() {
  console.log("___________index.js____________");
  return (
    <>
      <Head>
        <title>Dashboard</title>
      </Head>
      <Dashboard />
    </>
  );
}
