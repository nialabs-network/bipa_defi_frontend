import { nasmgLogo, diboLogo, expandArrow } from "../../assets/exports";
import Button from "../Reusables/Button";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { useAppContext, useWeb3Context } from "../../Contexts";
import periods from "./lockPools";
import { toast } from "react-toastify";
import { BN } from "bn.js";
import { getPrice, getMaticPrice } from "../Swap/quote";
export default function Lock({ styles, toggle, selected }) {
  const [amount, setAmount] = useState("");
  const [isLock, setIsLock] = useState(true); //toggle lock and unlock
  const { web3State } = useWeb3Context();
  const { web3Provider, contracts, address } = web3State;
  const { setLoadingState } = useAppContext();
  const [lockOf, setLockOf] = useState(null);
  const [nasmgBalance, setNasmgBalance] = useState("1");
  const [currentAllowance, setCurrentAllowance] = useState("");
  const token = { ticker: "NASMG", amount };

  async function getBlockchainData() {
    console.log("getting blockchain data");
    try {
      console.log(selected && selected !== "stake");
      if (selected && selected !== "stake") {
        const balance = await contracts.NASMG.methods.balanceOf(address).call();
        setNasmgBalance(
          Math.trunc(
            Number(web3Provider.utils.fromWei(balance, "ether") * 100)
          ) / 100
        );
        const lockOf = await contracts.lock[selected].methods
          .lockOf(address)
          .call();
        let claimableRewards;
        claimableRewards = await contracts.lock[selected].methods
          .claimableRewards()
          .call({ from: address });
        setLockOf({ ...lockOf, claimableRewards });
      }
    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    function getTVL() {
      Object.keys(periods).forEach(async (key) => {
        const tvl = address
          ? await contracts.lock[key].methods.totalValueLocked().call()
          : "0";
        document.getElementById(key)
          ? (document.getElementById(key).innerText =
              "TVL: " +
              (address ? web3Provider.utils.fromWei(tvl, "ether") : "0"))
          : null;
      });
    }
    if (address) {
      try {
        setLockOf(null);
        getBlockchainData();
        allowanceCheck();
        getTVL();
      } catch (e) {
        console.log(e);
      }
    } else {
      getTVL();
    }
  }, [address, selected, amount, isLock]);
  async function approve() {
    const gasPrice = await web3Provider.eth.getGasPrice();
    setLoadingState(true, "Approving");
    try {
      await contracts.NASMG.methods
        .approve(
          contracts.lock[selected]._address,
          web3Provider.utils.toWei(amount + 1000, "ether")
        )
        .send({ from: address, gasPrice });
    } catch (e) {
      console.log(e);
      setLoadingState(false, "");
    }
    setLoadingState(false, "");
  }

  async function lock() {
    try {
      setLoadingState(true, "Locking");
      const gasPrice = await web3Provider.eth.getGasPrice();
      console.log(gasPrice, "gasprice before lock");
      const price = await getPrice(token, web3Provider);
      const matic = await getMaticPrice(web3Provider);
      const diboInterestForPeriod = await contracts.lock[selected].methods
        .diboInterestForPeriod()
        .call();
      const diboPrice = await contracts.lock[selected].methods
        .diboPriceKRW()
        .call();
      const lockPeriod = await contracts.lock[selected].methods
        .lockPeriod()
        .call();
      const oracle = await contracts.KRWexrate.methods.latestAnswer().call();
      const USDKRW = Number((1 / (oracle / 10 ** 8)).toFixed(2));
      console.log(USDKRW, "korean won");
      const dollarValueOfStake = matic * price;
      console.log(matic, "matic/usd");
      console.log(price, "nasmg/matic");
      const KRWvalueOfStake = dollarValueOfStake * USDKRW;
      console.log(dollarValueOfStake, "dollar value of stake");
      console.log(KRWvalueOfStake, "stake value in KRW");
      const diboInterest =
        (KRWvalueOfStake / 100) *
        web3Provider.utils.fromWei(diboInterestForPeriod, "ether");
      console.log(diboInterest, "dibo interest based on krw stake value");
      const diboRewardsAmount =
        diboInterest / web3Provider.utils.fromWei(diboPrice, "ether"); //tokens to be sent
      console.log(diboRewardsAmount, "dibo tokens to receive");
      const diboPerSecond = new BN(
        web3Provider.utils.toWei(String(diboRewardsAmount.toFixed(18)), "ether")
      )
        .div(new BN(lockPeriod))
        .toString();
      console.log(diboPerSecond, "dibo in wei per second");
      await contracts.lock[selected].methods
        .lock(web3Provider.utils.toWei(amount, "ether"), diboPerSecond)
        .send({ from: address, gasPrice });
      setLoadingState(false, "");
      setAmount("");
      document.location.reload();
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
      document.location.reload();
    } catch (e) {
      console.log(e);
      setLoadingState(false, "");
    }
  }
  async function claim() {
    const gasPrice = await web3Provider.eth.getGasPrice();
    try {
      setLoadingState(true, "Claiming rewards");
      await contracts.lock[selected].methods
        .claimDiboRewards()
        .send({ from: address, gasPrice });
      setLoadingState(false, "");
      setAmount("");
      document.location.reload();
    } catch (e) {
      console.log(e);
      setLoadingState(false, "");
    }
  }
  function handleMaxClick() {
    setAmount(nasmgBalance.toString());
  }

  async function allowanceCheck() {
    if (selected) {
      let spenderAddress = undefined;
      if (selected == "stake") {
        spenderAddress = contracts[selected]._address;
      } else {
        spenderAddress = contracts.lock[selected]._address;
      }
      const allowance = await contracts.NASMG.methods
        .allowance(address, spenderAddress)
        .call();
      setCurrentAllowance(
        Number(web3Provider.utils.fromWei(allowance, "ether"))
      );
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
            onClick={
              address
                ? () => toggle(periods[key].period)
                : () => toast.error("Connect Wallet")
            }
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
              <p className={styles.title}>NASMG + DIBO Lock</p>
              <p className={styles.amount} id={key}></p>
            </div>
            <div className={styles.productInterest}>
              <p className={styles.interest}>{periods[key].interest}</p>
              <p className={styles.apr}></p>
            </div>
            <div className={styles.productInfo}>
              <div className={styles.titles}>
                <p>Earn</p>
                <p>Interest</p>
              </div>
              <div className={styles.values}>
                <p>DIBO</p> <p>{periods[key].diboInterest}</p>
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
              <p>your NASMG</p>

              {isLock ? (
                <>
                  <div style={{ position: "relative", width: "100%" }}>
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
                    <button className={styles.maxBut} onClick={handleMaxClick}>
                      MAX
                    </button>
                  </div>
                </>
              ) : (
                <input
                  type="number"
                  className={styles.formInput}
                  value={
                    web3Provider && lockOf
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
                    {nasmgBalance}
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
                ) : currentAllowance >= amount ? (
                  <Button
                    value={
                      Number(amount) < 1
                        ? "Enter the amount"
                        : Number(amount) > Number(nasmgBalance)
                        ? "Not enough tokens"
                        : "Lock"
                    }
                    style={
                      Number(amount) < 1
                        ? {
                            margin: "0",
                            cursor: "default",
                            boxShadow: "none",
                            backgroundColor: "#bbb",
                          }
                        : Number(amount) > Number(nasmgBalance)
                        ? {
                            margin: "0",
                            cursor: "default",
                            boxShadow: "none",
                            backgroundColor: "#bbb",
                          }
                        : { margin: "0" }
                    }
                    onclick={
                      Number(amount) <= 0
                        ? null
                        : Number(amount) > Number(nasmgBalance)
                        ? null
                        : () => lock()
                    }
                  />
                ) : (
                  <Button
                    value={"Approve"}
                    onclick={approve}
                    style={{ margin: "0" }}
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
                  onclick={null}
                />
              ) : (
                <Button
                  value={
                    Number(lockOf?.lockedAmount) > 0
                      ? "Unlock & Claim"
                      : "You have nothing no unlock"
                  }
                  style={
                    Number(lockOf?.lockedAmount) > 0
                      ? { margin: "0" }
                      : {
                          margin: "0",
                          cursor: "default",
                          boxShadow: "none",
                          backgroundColor: "#bbb",
                        }
                  }
                  onclick={Number(lockOf?.lockedAmount) > 0 ? withdraw : null}
                />
              )}
            </div>

            <div className={styles.infoArea}>
              <div className={styles.apr}>
                <p className={styles.title}>Interest</p>
                <p>{periods[key].interest}</p>
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
                      ? Number(
                          web3Provider?.utils.fromWei(
                            lockOf.nasmgPaidOutRewards,
                            "ether"
                          )
                        ).toFixed(6)
                      : "0"}{" "}
                    {lockOf
                      ? (
                          Number(
                            web3Provider.utils.fromWei(
                              new BN(periods[key].lockPeriod, 10)
                                .mul(new BN(periods[key].interestPerSecond, 10))
                                .toString()
                            )
                          ) *
                          Number(
                            web3Provider.utils.fromWei(
                              lockOf.lockedAmount,
                              "ether"
                            )
                          )
                        ).toFixed(6)
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
                      ? Number(
                          web3Provider?.utils.fromWei(
                            lockOf.diboPaidOutRewards,
                            "ether"
                          )
                        ).toFixed(6)
                      : "0"}
                    (
                    {lockOf
                      ? Number(
                          web3Provider?.utils.fromWei(
                            lockOf.claimableRewards
                              ? lockOf.claimableRewards
                              : "0",
                            "ether"
                          )
                        ).toFixed(6)
                      : "0"}
                    )<small>claimable</small>
                  </p>
                  <p style={{ textAlign: "right" }}>DIBO</p>
                </div>
              </div>

              <Button
                value={
                  lockOf?.claimableRewards !== "0" &&
                  lockOf?.lockedAmount !== "0"
                    ? "Claim DIBO"
                    : "Nothing to claim"
                }
                style={
                  lockOf !== null &&
                  lockOf?.claimableRewards !== "0" &&
                  lockOf?.lockedAmount !== "0"
                    ? {
                        backgroundColor: "transparent",
                        outline: "solid 2px #81c9e9",
                        marginBottom: "0px",
                        marginTop: "0px",
                      }
                    : {
                        margin: "0",
                        cursor: "default",
                        boxShadow: "none",
                        backgroundColor: "#bbb",
                      }
                }
                onclick={
                  lockOf &&
                  (lockOf?.claimableRewards !== "0" &&
                  lockOf?.lockedAmount !== "0"
                    ? claim
                    : null)
                }
              />
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}
