import { nasmgLogo, diboLogo, expandArrow } from "../../assets/exports";
import Image from "next/image";
import Button from "../../Components/Reusables/Button";
import { useState, useEffect } from "react";
import { useAppContext, useWeb3Context } from "../../Contexts";

export default function Stake({ styles, toggle, selected }) {
  const { web3State } = useWeb3Context();
  const { setLoadingState } = useAppContext();
  const { web3Provider, address, contracts } = web3State;
  const [isDeposit, setIsDeposit] = useState(true); //toggle deposit withdrawal
  const [blockchainData, setBlockchainData] = useState(null);
  const [nasmgBalance, setNasmgBalance] = useState("0");
  const [amount, setAmount] = useState("");
  const [stakingBalance, setStakingBalance] = useState("");

  useEffect(() => {
    if (address) {
      getBlockchainData();
    }
  }, [address, amount, isDeposit, selected]);
  async function getBlockchainData() {
    const balance = await contracts.NASMG.methods.balanceOf(address).call();
    const stakingInfo = await contracts.stake.methods
      .stakingInfo(address)
      .call();
    const claimableRewards = await contracts.stake.methods
      .claimableRewards()
      .call({ from: address });
    setNasmgBalance(
      Math.trunc(Number(web3Provider.utils.fromWei(balance, "ether") * 100)) /
        100
    );
    setBlockchainData({
      stakingInfo,
      claimableRewards,
    });
    setStakingBalance(
      Math.trunc(
        Number(
          web3Provider.utils.fromWei(stakingInfo.stakingBalance, "ether") * 100
        )
      ) / 100
    );
  }
  async function stake() {
    console.log("stake strike");
    try {
      if (contracts.stake) {
        setLoadingState(true, "Approving");
        await contracts.NASMG.methods
          .approve(
            contracts.stake._address,
            web3Provider.utils.toWei(amount, "ether")
          )
          .send({ from: address });
        setLoadingState(true, "Staking");
        await contracts.stake.methods
          .stakeTokens(web3Provider.utils.toWei(amount, "ether"))
          .send({
            from: address,
          });
        setLoadingState(false, "");
        setAmount("");
        document.location.reload();
      }
    } catch (e) {
      console.log(e);
      setLoadingState(false, "");
    }
  }
  async function unstake() {
    if (contracts.stake) {
      try {
        console.log("unstake");
        setLoadingState(true, "Unstaking");
        await contracts.stake.methods
          .unstakeTokens(web3Provider.utils.toWei(amount, "ether"))
          .send({ from: address });
        setLoadingState(false, "");
        setAmount("");
        document.location.reload();
      } catch (e) {
        console.log("Error, withdraw: ", e);
        setLoadingState(false, "");
      }
    }
  }
  async function claimRewards() {
    if (contracts.stake) {
      try {
        setLoadingState(true, "Claiming rewards");
        await contracts.stake.methods.claimRewards().send({ from: address });
        setLoadingState(false, "");
      } catch (e) {
        console.log(e);
        setLoadingState(false, "");
      }
      setBlockchainData((prevState) => {
        return { ...prevState, claimableRewards: 0 };
      });
      getBlockchainData();
    }
    document.location.reload();
  }
  function handleMaxClick() {
    if (isDeposit) {
      setAmount(nasmgBalance.toString());
    } else {
      setAmount(stakingBalance.toString());
    }
  }
  return (
    <section className={styles.accordion}>
      <div
        className={`${styles.stakingSection} glass`}
        style={{ border: "3px solid #cdabef" }}
      >
        <span className={styles.label} style={{ backgroundColor: "#cdabef" }}>
          STAKE
        </span>

        <div
          className={styles.flex}
          onClick={() => {
            toggle("stake");
          }}
        >
          <div className={styles.logo}>
            <div className={styles.stakeLogo}>
              <Image
                src={nasmgLogo}
                width={nasmgLogo.width}
                height={nasmgLogo.height}
              />
            </div>
          </div>
          <div className={styles.productTitle}>
            <p className={styles.title}>NASMG Staking</p>
            <p className={styles.amount}>TVL TBD</p>
          </div>
          <div className={styles.productInterest}>
            <p className={styles.interest}>25% TBD</p>
            <p className={styles.apr}>APR 22% TBD</p>
          </div>
          <div className={styles.productInfo}>
            <div className={styles.titles}>
              <p>Earn</p>
              <p style={{ paddingTop: "12px" }}>Balance</p>
            </div>
            <div className={styles.values}>
              <p>NASMG</p> <p style={{ paddingTop: "12px" }}>{nasmgBalance}</p>
            </div>
          </div>
          <div className={styles.period}>Flexible</div>
          <button
            className={styles.accordion_button}
            style={selected == "stake" ? { transform: "rotate(180deg)" } : null}
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
          style={selected !== "stake" ? { display: "none" } : null}
        >
          <div className={styles.inputArea}>
            <div className={styles.depWitButtons}>
              <button
                onClick={() => {
                  setIsDeposit(true);
                }}
                className={`${styles.button}`}
                style={isDeposit ? { backgroundColor: "#6d76b2" } : null}
              >
                Deposit
              </button>
              <button
                className={styles.button}
                style={isDeposit ? null : { backgroundColor: "#6d76b2" }}
                onClick={() => {
                  setIsDeposit(false);
                }}
              >
                Withdraw
              </button>
            </div>
            <p>your amount</p>
            <div style={{ position: "relative", width: "100%" }}>
              <input
                type="number"
                className={styles.formInput}
                placeholder="0"
                style={{ textAlign: "left" }}
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value);
                }}
              />
              <button className={styles.maxBut} onClick={handleMaxClick}>
                MAX
              </button>
            </div>
            <div className={styles.depositWalletBal}>
              <p>Wallet Balance:</p>
              <div>
                <span style={{ display: "block" }}>NASMG</span>
                <span style={{ display: "block", textAlign: "right" }}>
                  {nasmgBalance}
                </span>
              </div>
            </div>

            {isDeposit ? (
              <Button
                value={
                  Number(nasmgBalance) < Number(amount)
                    ? "Not enough tokens"
                    : Number(amount) > 0
                    ? "Approve & Deposit"
                    : "Enter the amount"
                }
                style={
                  Number(nasmgBalance) < Number(amount)
                    ? {
                        margin: "0",
                        cursor: "default",
                        boxShadow: "none",
                        backgroundColor: "#bbb",
                      }
                    : Number(amount) > 0
                    ? { margin: "0", backgroundColor: "rgb(205, 171, 239)" }
                    : {
                        margin: "0",
                        cursor: "default",
                        boxShadow: "none",
                        backgroundColor: "#bbb",
                      }
                }
                onclick={
                  Number(nasmgBalance) < Number(amount)
                    ? null
                    : Number(amount) > 0
                    ? stake
                    : null
                }
              />
            ) : (
              <Button
                value={
                  Number(amount) <= Number(stakingBalance)
                    ? Number(amount) <= 0
                      ? "Enter the amount"
                      : "Withdraw"
                    : "Too much to withdraw"
                }
                style={
                  Number(amount) <= Number(stakingBalance)
                    ? Number(amount) <= 0
                      ? {
                          margin: "0",
                          cursor: "default",
                          boxShadow: "none",
                          backgroundColor: "#bbb",
                        }
                      : { margin: "0", backgroundColor: "rgb(205, 171, 239)" }
                    : {
                        margin: "0",
                        cursor: "default",
                        boxShadow: "none",
                        backgroundColor: "#bbb",
                      }
                }
                onclick={unstake}
              />
            )}
          </div>

          <div className={styles.infoArea}>
            <div className={styles.apr}>
              <p className={styles.title}>APR</p>
              <p>70% (static)</p>
            </div>
            <div className={styles.deposit}>
              <p className={styles.title}>Deposit</p>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <p style={{ color: "lime" }}>{stakingBalance}</p>
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
                  {web3Provider &&
                  blockchainData?.stakingInfo.paidOutRewards !== "0"
                    ? Number(
                        web3Provider?.utils.fromWei(
                          blockchainData?.stakingInfo.paidOutRewards
                            ? blockchainData.stakingInfo.paidOutRewards
                            : "",
                          "ether"
                        )
                      ).toFixed(3)
                    : ""}
                  (
                  {web3Provider
                    ? Number(
                        web3Provider?.utils.fromWei(
                          blockchainData?.claimableRewards
                            ? blockchainData.claimableRewards
                            : "",
                          "ether"
                        )
                      ).toFixed(6)
                    : "N/A"}
                  )<small> claimable</small>
                </p>
                <p style={{ textAlign: "right" }}>NASMG</p>
              </div>
            </div>
            <Button
              value={
                blockchainData?.claimableRewards !== "0"
                  ? "Claim Rewards"
                  : "Nothing to claim"
              }
              onclick={
                blockchainData?.claimableRewards == "0" ? null : claimRewards
              }
              style={
                blockchainData?.claimableRewards !== "0"
                  ? {
                      backgroundColor: "transparent",
                      outline: "solid 2px rgb(205, 171, 239)",
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
            />
          </div>
        </div>
      </div>
    </section>
  );
}
