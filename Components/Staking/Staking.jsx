import Stake from "./Stake";
import Lock from "./Lock";
import styles from "./Staking.module.scss";
import { useState, useEffect } from "react";
import { useAppContext, useWeb3Context } from "../../Contexts";
import abi from "./abi.js";
import erc20 from "./erc20.js";
export default function Staking() {
  const { web3State } = useWeb3Context();
  const { appState, setLoadingState } = useAppContext();
  const { web3Provider, address, network, balance } = web3State;
  const [selected, setSelected] = useState("");
  const [lockcontract, setlockcontract] = useState("");
  const [nasmgContract, setNasmgContract] = useState("");
  const [lockInfo, setLockInfo] = useState("");
  function toggle(i) {
    if (selected == i) {
      return setSelected("");
    }
    return setSelected(i);
  }
  async function lock(amount) {
    try {
      setLoadingState(true, "locking tokens");
      await lockcontract.methods
        .lock(web3Provider.utils.toWei(amount))
        .send({ from: address });
      setLoadingState(false, "");
    } catch (e) {
      console.log(e);
      setLoadingState(false, "");
    }
  }
  async function withdraw() {
    try {
      setLoadingState(true, "locking tokens");
      await lockcontract.methods.withdraw().send({ from: address });
      setLoadingState(false, "");
    } catch (e) {
      console.log(e);
      setLoadingState(false, "");
    }
  }
  useEffect(async () => {
    if (address) {
      const lockContract = new web3Provider.eth.Contract(
        abi,
        "0xea006c611c2dCA8bF9c26420fA6b7dB9CCec0670"
      );
      setlockcontract(lockContract);
      console.log(await lockContract.methods.totalLocked().call());
      const nasmgContract = new web3Provider.eth.Contract(
        erc20,
        "0x310Cf9575ea20443e6E82B67d2545FA87557258B"
      );
      setNasmgContract(nasmgContract);
      setLockInfo({
        nasmgBalance: await nasmgContract.methods.balanceOf(address).call(),
      });
    }
  }, [address]);
  return (
    <section className={styles.stakingContainer}>
      <div className={styles.separator}>
        <h3 className={styles.title}>STAKE</h3>
        <span className={styles.line}></span>
      </div>
      <Stake styles={styles} toggle={toggle} selected={selected} />

      <div className={styles.separator}>
        <h3 className={styles.title}>LOCK</h3>
        <span
          className={styles.line}
          style={{ borderBottom: "4px #81c9e9 solid" }}
        ></span>
      </div>
      <Lock
        styles={styles}
        toggle={toggle}
        selected={selected}
        nasmgBalance={
          web3Provider
            ? Number(
                web3Provider.utils.fromWei(
                  lockInfo.nasmgBalance ? lockInfo.nasmgBalance : "",
                  "ether"
                )
              ).toFixed(2)
            : null
        }
        lock={lock}
        withdraw={withdraw}
      />
    </section>
  );
}
