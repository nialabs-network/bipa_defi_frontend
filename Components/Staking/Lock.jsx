import { nasmgLogo, diboLogo, expandArrow } from "../../assets/exports";
import Button from "../Reusables/Button";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useAppContext, useWeb3Context } from "../../Contexts";
const periods = {
  30: {
    period: 30,
    interest: "7%",
    lockPeriod: 300,
    interestPerSecond: 100000000,
  },
  90: {
    period: 90,
    interest: "10%",
    lockPeriod: 900,
    interestPerSecond: 100000000,
  },
};
export default function Lock({ styles, toggle, selected }) {
  const [amount, setAmount] = useState("");
  const [isLock, setIsLock] = useState(true); //toggle lock and unlock
  const { web3State } = useWeb3Context();
  const { web3Provider, contracts, address } = web3State;
  const { setLoadingState } = useAppContext();
  const [lockOf, setLockOf] = useState(null);
  const [nasmgBalance, setNasmgBalance] = useState("1");
  async function getBlockchainData() {
    setLoadingState(true, "Getting data from blockchain...");
    if (selected && selected !== "stake") {
      const balance = await contracts.NASMG.methods.balanceOf(address).call();
      setNasmgBalance(balance);
      const lockOf = await contracts.lock[selected].methods
        .lockOf(address)
        .call();
      let claimableRewards;
      if (lockOf.lockedAmount > 0) {
        claimableRewards = await contracts.lock[selected].methods
          .claimableRewards()
          .call({ from: address });
      }
      setLockOf({ ...lockOf, claimableRewards });
    }
    setLoadingState(false, "");
  }
  useEffect(() => {
    if (address) {
      try {
        getBlockchainData();
      } catch (e) {
        console.log(e);
      }
    }
  }, [address, selected, amount]);
  async function lock(amount) {
    try {
      setLoadingState(true, "Locking");
      await contracts.lock[selected].methods
        .lock(web3Provider.utils.toWei(amount, "ether"))
        .send({ from: address });
      setLoadingState(false, "");
      setAmount("");
      getBlockchainData();
    } catch (e) {
      console.log(e);
      setLoadingState(false, "");
    }
  }
  async function withdraw() {
    try {
      setLoadingState(true, "Withdrawing");
      await contracts.lock[selected].methods.withdraw().send({ from: address });
      setLoadingState(false, "");
      setAmount("");
    } catch (e) {
      console.log(e);
      setLoadingState(false, "");
    }
  }
  async function claim() {
    try {
      setLoadingState(true, "Withdrawing");
      await contracts.lock[selected].methods
        .claimDiboRewards()
        .send({ from: address });
      setLoadingState(false, "");
      setAmount("");
    } catch (e) {
      console.log(e);
      setLoadingState(false, "");
    }
  }
  return (
    <section className={styles.accordion}>
      {Object.keys(periods).map((key) => (
        <div
          className={`${styles.stakingSection} glass`}
          key={periods[key].period}
        >
          <span className={styles.label}>LOCK</span>
          <div
            className={styles.flex}
            onClick={() => toggle(periods[key].period)}
          >
            <div className={styles.logo}>
              <div className={styles.stakeLogo}>
                <Image
                  src={nasmgLogo}
                  width={nasmgLogo.width}
                  height={nasmgLogo.height}
                />
              </div>
              <div className={styles.stakeLogo}>
                <Image
                  src={diboLogo}
                  width={diboLogo.width}
                  height={diboLogo.height}
                />
              </div>
            </div>
            <div className={styles.productTitle}>
              <p className={styles.title}>NASMG Staking</p>
              <p className={styles.amount}>$197,000,000</p>
            </div>
            <div className={styles.productInterest}>
              <p className={styles.interest}>{periods[key].interest}</p>
              <p className={styles.apr}>APR 22%</p>
            </div>
            <div className={styles.productInfo}>
              <div className={styles.titles}>
                <p>Earn</p>
                <p>Balance</p>
              </div>
              <div className={styles.values}>
                <p>KLAY</p> <p>%0</p>
              </div>
            </div>
            <div className={styles.period}>
              {periods[key].period + " "}
              Days
            </div>
            <button
              className={styles.accordion_button}
              style={
                selected == periods[key].period
                  ? { transform: "rotate(180deg)" }
                  : null
              }
            >
              <Image src={expandArrow} width={24} height={24} />
            </button>
          </div>
          <span
            style={{
              border: "solid 1px #6667ab",
              width: "100%",
              display: "block",
              opacity: "0.5",
              marginTop: "10px",
            }}
          ></span>
          <div
            className={styles.depositContainer}
            style={
              selected !== periods[key].period ? { display: "none" } : null
            }
          >
            <div className={styles.inputArea}>
              <div className={styles.depWitButtons}>
                <button
                  onClick={() => {
                    setIsLock(true);
                  }}
                  className={`${styles.button}`}
                  style={isLock ? { backgroundColor: "#6d76b2" } : null}
                >
                  Deposit
                </button>
                <button
                  className={styles.button}
                  style={isLock ? null : { backgroundColor: "#6d76b2" }}
                  onClick={() => {
                    setIsLock(false);
                  }}
                >
                  Withdraw
                </button>
              </div>
              <p>0.5% fee for witdrawals within 3 days</p>

              {isLock ? (
                <input
                  type="number"
                  className={styles.formInput}
                  placeholder="0"
                  value={amount}
                  onChange={(e) => {
                    setAmount(e.target.value);
                  }}
                  style={{ textAlign: "left" }}
                  disabled={Number(lockOf?.lockedAmount) > 0 ? true : false}
                />
              ) : (
                <input
                  type="number"
                  className={styles.formInput}
                  value={
                    web3Provider
                      ? web3Provider.utils.fromWei(lockOf.lockedAmount, "ether")
                      : ""
                  }
                  style={{ textAlign: "left" }}
                  disabled
                />
              )}

              <div className={styles.depositWalletBal}>
                <p>Wallet Balance:</p>
                <div>
                  <span style={{ display: "block" }}>NASMG</span>
                  <span style={{ display: "block", textAlign: "right" }}>
                    {web3Provider
                      ? Number(
                          web3Provider.utils.fromWei(nasmgBalance, "ether")
                        ).toFixed(2)
                      : null}
                  </span>
                </div>
              </div>
              {isLock ? (
                Number(lockOf?.lockedAmount) > 0 ? (
                  <Button
                    value="You have already deposited"
                    style={{
                      margin: "0",
                      cursor: "default",
                      boxShadow: "none",
                      backgroundColor: "#bbb",
                    }}
                  />
                ) : (
                  <Button
                    value="Lock"
                    style={{ margin: "0" }}
                    onclick={() => lock(amount)}
                  />
                )
              ) : Number(lockOf?.lockTime) + Number(periods[key].lockPeriod) >
                Math.round(Date.now() / 1000) ? (
                <Button
                  value="Assets are still locked"
                  style={{
                    margin: "0",
                    cursor: "default",
                    boxShadow: "none",
                    backgroundColor: "#bbb",
                  }}
                  onclick={withdraw}
                />
              ) : (
                <Button
                  value="Unlock"
                  style={{ margin: "0" }}
                  onclick={withdraw}
                />
              )}
            </div>

            <div className={styles.infoArea}>
              <div className={styles.apr}>
                <p className={styles.title}>APR</p>
                <p>70%</p>
              </div>
              <div className={styles.deposit}>
                <p className={styles.title}>Total Locked</p>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <p style={{ color: "lime" }}>
                    {lockOf
                      ? web3Provider?.utils.fromWei(
                          lockOf.lockedAmount,
                          "ether"
                        )
                      : "0"}
                  </p>
                  <p>NASMG</p>
                </div>
              </div>
              <div className={styles.rewards}>
                <p className={styles.title}>Earned Rewards</p>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <p style={{ color: "lime" }}>
                    {lockOf
                      ? web3Provider?.utils.fromWei(
                          lockOf.nasmgPaidOutRewards,
                          "ether"
                        )
                      : "0"}{" "}
                    {lockOf
                      ? web3Provider?.utils.fromWei(
                          (
                            periods[key].lockPeriod *
                            periods[key].interestPerSecond *
                            Number(
                              web3Provider.utils.fromWei(
                                lockOf.lockedAmount,
                                "ether"
                              )
                            )
                          ).toString(),
                          "ether"
                        )
                      : "0"}
                    <small>estimated</small>
                  </p>
                  <p style={{ textAlign: "right" }}>NASMG</p>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <p style={{ color: "lime" }}>
                    {lockOf
                      ? web3Provider?.utils.fromWei(
                          lockOf.diboPaidOutRewards,
                          "ether"
                        )
                      : "0"}
                    (
                    {lockOf
                      ? web3Provider?.utils.fromWei(
                          lockOf.claimableRewards
                            ? lockOf.claimableRewards
                            : "0",
                          "ether"
                        )
                      : "0"}
                    )<small>claimable</small>
                  </p>
                  <p style={{ textAlign: "right" }}>DIBO</p>
                </div>
              </div>
              <Button
                value="Claim DIBO"
                style={{
                  backgroundColor: "transparent",
                  outline: "solid 2px #81c9e9",
                  marginBottom: "0px",
                  marginTop: "0px",
                }}
                onclick={claim}
              />
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}
