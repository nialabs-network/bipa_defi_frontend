import Stake from "./Stake";
import Lock from "./Lock";
import styles from "./Staking.module.scss";
import { useState, useEffect } from "react";
import { useAppContext, useWeb3Context } from "../../Contexts";
import StakingArt from "../../artifacts/Staking.json";
export default function Staking() {
  const { web3State } = useWeb3Context();
  const { web3Provider, address, contracts } = web3State;
  const [selected, setSelected] = useState("");
  const [nasmgBalance, setNasmgBalance] = useState("");
  const [allowance, setAllowance] = useState("");
  function toggle(i) {
    if (selected == i) {
      return setSelected("");
    }
    return setSelected(i);
  }

  async function getBlockchainData() {
    const NASMGbalance = await contracts.NASMG.methods
      .balanceOf(address)
      .call();
    // const owner = await contracts.NASMG.methods.owner().call();
    // console.log(await contracts.NASMG.methods.balanceOf(owner).call());
    const allowance = await contracts.NASMG.methods
      .allowance(address, StakingArt.networks["5777"].address)
      .call();
    setAllowance(allowance);
    setNasmgBalance(NASMGbalance);
  }

  useEffect(() => {
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
        allowance={allowance}
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
        allowance={allowance}
      />
    </section>
  );
}
