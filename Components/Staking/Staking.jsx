import Stake from "./Stake";
import Lock from "./Lock";
import styles from "./Staking.module.scss";
import { useState, useEffect } from "react";
import { useAppContext, useWeb3Context } from "../../Contexts";

export default function Staking() {
  const { web3State } = useWeb3Context();
  const { web3Provider, address, contracts } = web3State;
  const [selected, setSelected] = useState("");
  const [nasmgBalance, setNasmgBalance] = useState("");
  function toggle(i) {
    if (selected == i) {
      return setSelected("");
    }
    return setSelected(i);
  }
  useEffect(() => {
    async function getBlockchainData() {
      const NASMGbalance = await contracts.NASMG.methods
        .balanceOf(address)
        .call();
      setNasmgBalance(NASMGbalance);
    }
    if (address) {
      getBlockchainData();
    }
  }, [address]);
  return (
    <section className={styles.stakingContainer}>
      <div className={styles.separator}>
        <h3 className={styles.title}>STAKE</h3>
        <span className={styles.line}></span>
      </div>
      <Stake
        styles={styles}
        toggle={toggle}
        selected={selected}
        nasmgBalance={nasmgBalance}
      />

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
        nasmgBalance={nasmgBalance}
      />
    </section>
  );
}
