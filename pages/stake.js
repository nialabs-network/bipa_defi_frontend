import React, { useState } from "react";
import { toast } from "react-toastify";
import { useWeb3Context } from "../Contexts";
export default function Stake() {
  const { web3State } = useWeb3Context();
  const [number, setNumber] = useState("");
  const [blocknumb, setBlocknum] = useState("");
  const handleChange = (e) => {
    setNumber(e.target.value);
  };
  if (web3State.contract) {
    async function getblock() {
      setBlocknum(await web3State.contract.methods.retrieve().call());
    }
    getblock();
  }
  const saveNumber = async () => {
    console.log(number);
    if (number) {
      web3State.contract.methods
        .store(number)
        .send({
          from: web3State.address,
          gasLimit: 500000,
        })
        .then((receipt) => {
          web3State.contract.methods
            .retrieve()
            .call()
            .then((receipt) => setBlocknum(receipt));
        });
    } else {
      console.log("you should enter a number");
    }
  };
  function logg() {
    console.log(web3State);
  }
  return (
    <div>
      <input onChange={handleChange} value={number} type="number" required />
      <button onClick={saveNumber}>Save number</button>
      <h1>{number}</h1>
      <h1>{blocknumb}</h1>
      <h1>
        {web3State.contract ? "Contract connected" : "contract not connected"}
      </h1>
      <button onClick={logg}>LOG IT</button>
    </div>
  );
}
