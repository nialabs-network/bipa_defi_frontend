import { nasmgLogo, diboLogo, expandArrow } from "../../assets/exports";
import Image from "next/image";
import Button from "../../Components/Reusables/Button";
import { useState, useEffect } from "react";
import { useAppContext, useWeb3Context } from "../../Contexts";

export default function Stake({ styles, toggle, selected, nasmgBalance }) {
  const { web3State } = useWeb3Context();
  const { appState, setLoadingState } = useAppContext();
  const { web3Provider, address, contracts } = web3State;
  const [isDeposit, setIsDeposit] = useState(true); //toggle deposit withdrawal
  const [blockchainData, setBlockchainData] = useState({});
  const [amount, setAmount] = useState("");

  useEffect(() => {
    async function getBlockchainData() {
      const NASMGDeposited = await contracts.stake.methods
        .stakingBalance(address)
        .call();
      const paidOutRewards = await contracts.stake.methods
        .paidOutRewards(address)
        .call();
      const claimableRewards = await contracts.stake.methods
        .claimableRewards()
        .call({ from: address });

      setBlockchainData({
        NASMGDeposited,
        paidOutRewards,
        claimableRewards,
      });
    }
    if (address) {
      getBlockchainData();
    }
  }, [address, amount]);
  async function stake() {
    console.log("stake strike");
    try {
      if (contracts.stake) {
        setLoadingState(true, "Staking");
        await contracts.stake.methods
          .stakeTokens(web3Provider.utils.toWei(amount, "ether"))
          .send({
            from: address,
          });
        setLoadingState(false, "");
        setAmount("");
      }
    } catch (e) {
      console.log(e);
      setLoadingState(false, "");
    }
  }
  async function unstake() {
    if (contracts.stake) {
      try {
        await contracts.stake.methods
          .unstakeTokens(web3Provider.utils.toWei(amount, "ether"))
          .send({ from: address });
        setAmount("");
      } catch (e) {
        console.log("Error, withdraw: ", e);
      }
    }
  }
  async function claimRewards() {
    if (contracts.stake) {
      try {
        await contracts.stake.methods.claimRewards().send({ from: address });
      } catch (e) {
        console.log(e);
      }
      setBlockchainData((prevState) => {
        return { ...prevState, claimableRewards: 0 };
      });
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
            <p className={styles.amount}>TVL $197,000,000</p>
          </div>
          <div className={styles.productInterest}>
            <p className={styles.interest}>25%</p>
            <p className={styles.apr}>APR 22%</p>
          </div>
          <div className={styles.productInfo}>
            <div className={styles.titles}>
              <p>Earn</p>
              <p style={{ paddingTop: "12px" }}>Balance</p>
            </div>
            <div className={styles.values}>
              <p>KLAY</p> <p style={{ paddingTop: "12px" }}>%0</p>
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
            <input
              type="number"
              className={styles.formInput}
              placeholder="0"
              debounceTimeout={500}
              style={{ textAlign: "left" }}
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value);
              }}
            />
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
            {isDeposit ? (
              <Button value="Deposit" style={{ margin: "0" }} onclick={stake} />
            ) : (
              <Button
                value="Withdraw"
                style={{ margin: "0" }}
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
                <p style={{ color: "lime" }}>
                  {web3Provider
                    ? Number(
                        web3Provider.utils.fromWei(
                          blockchainData.NASMGDeposited
                            ? blockchainData.NASMGDeposited
                            : "",
                          "ether"
                        )
                      )
                    : null}
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
                  {blockchainData.paidOutRewards !== "0"
                    ? Number(
                        web3Provider?.utils.fromWei(
                          blockchainData.paidOutRewards
                            ? blockchainData.paidOutRewards
                            : "",
                          "ether"
                        )
                      ).toFixed(3)
                    : null}
                  (
                  {web3Provider
                    ? Number(
                        web3Provider.utils.fromWei(
                          blockchainData.claimableRewards
                            ? blockchainData.claimableRewards
                            : "",
                          "ether"
                        )
                      ).toFixed(7)
                    : null}
                  )<small> claimable</small>
                </p>
                <p style={{ textAlign: "right" }}>NASMG</p>
              </div>
            </div>
            <Button
              value="Claim Rewards"
              onclick={claimRewards}
              style={{
                backgroundColor: "transparent",
                outline: "solid 2px #81c9e9",
                marginBottom: "0px",
                marginTop: "0px",
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
