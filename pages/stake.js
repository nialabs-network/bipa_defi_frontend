import React, { useState } from "react";
import { toast } from "react-toastify";
import { useAppContext, useWeb3Context } from "../Contexts";
import storage from "../contracts/storage.abi";
export default function Stake() {
  console.error(storage);
  const { web3State } = useWeb3Context();
  function contractConnect() {
    web3State.dispatch({
      type: "LOAD_CONTRACT",
      contract: new web3State.web3Provider.eth.Contract(
        storage,
        "0xD86D2267465F53d87A946eE3332B58664D183a0F"
      ),
    });
    toast.success("contract loaded");
  }
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
  return (
    <div>
      <input onChange={handleChange} value={number} type="number" required />
      <button onClick={saveNumber}>Save number</button>
      <button onClick={contractConnect}>Connect contract</button>
      <h1>{number}</h1>
      <h1>{blocknumb}</h1>
      <h1>
        {web3State.contract ? "Contract connected" : "contract not connected"}
      </h1>
    </div>
  );
}
