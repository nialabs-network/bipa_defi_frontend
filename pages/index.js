import Head from "next/head";
import React from "react";
import Dashboard from "../Components/Dashboard/Dashboard";
export default function Home() {
  return (
    <>
      <Head>
        <title>Dashboard</title>
      </Head>
      <Dashboard />
    </>
  );
}
