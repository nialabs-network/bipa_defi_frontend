import { nasmgLogo, diboLogo, expandArrow } from "../../assets/exports";
import Button from "../Reusables/Button";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { useAppContext, useWeb3Context } from "../../Contexts";
import periods from "./lockPools";
import { toast } from "react-toastify";
import { BN } from "bn.js";
export default function ExistingLocks({ styles, toggle, selected }) {
  const [amount, setAmount] = useState("");
  const { web3State } = useWeb3Context();
  const { web3Provider, address } = web3State;
  const { setLoadingState } = useAppContext();
  const [lockOf, setLockOf] = useState("");
  const [contracts, setContracts] = useState(null);
  useEffect(() => {
    address &&
      setContracts({
        lock: {
          30:
            web3Provider &&
            new web3Provider.eth.Contract(
              [
                {
                  inputs: [
                    { internalType: "address", name: "nasmg", type: "address" },
                    { internalType: "address", name: "dibo", type: "address" },
                  ],
                  stateMutability: "nonpayable",
                  type: "constructor",
                },
                {
                  anonymous: false,
                  inputs: [
                    {
                      indexed: true,
                      internalType: "address",
                      name: "user",
                      type: "address",
                    },
                    {
                      indexed: false,
                      internalType: "uint256",
                      name: "amount",
                      type: "uint256",
                    },
                    {
                      indexed: false,
                      internalType: "uint256",
                      name: "timestamp",
                      type: "uint256",
                    },
                    {
                      indexed: false,
                      internalType: "uint256",
                      name: "totalValueLocked",
                      type: "uint256",
                    },
                  ],
                  name: "Deposit",
                  type: "event",
                },
                {
                  anonymous: false,
                  inputs: [
                    {
                      indexed: true,
                      internalType: "address",
                      name: "user",
                      type: "address",
                    },
                    {
                      indexed: false,
                      internalType: "uint256",
                      name: "amount",
                      type: "uint256",
                    },
                    {
                      indexed: false,
                      internalType: "uint256",
                      name: "timestamp",
                      type: "uint256",
                    },
                    {
                      indexed: false,
                      internalType: "uint256",
                      name: "totalValueLocked",
                      type: "uint256",
                    },
                  ],
                  name: "Withdraw",
                  type: "event",
                },
                {
                  inputs: [],
                  name: "claimDiboRewards",
                  outputs: [],
                  stateMutability: "nonpayable",
                  type: "function",
                },
                {
                  inputs: [],
                  name: "claimableRewards",
                  outputs: [
                    { internalType: "uint256", name: "", type: "uint256" },
                  ],
                  stateMutability: "view",
                  type: "function",
                },
                {
                  inputs: [
                    {
                      internalType: "uint256",
                      name: "_amount",
                      type: "uint256",
                    },
                  ],
                  name: "lock",
                  outputs: [],
                  stateMutability: "nonpayable",
                  type: "function",
                },
                {
                  inputs: [
                    { internalType: "address", name: "", type: "address" },
                  ],
                  name: "lockOf",
                  outputs: [
                    { internalType: "address", name: "owner", type: "address" },
                    {
                      internalType: "uint256",
                      name: "lockedAmount",
                      type: "uint256",
                    },
                    {
                      internalType: "uint256",
                      name: "lockTime",
                      type: "uint256",
                    },
                    {
                      internalType: "uint256",
                      name: "lastClaim",
                      type: "uint256",
                    },
                    {
                      internalType: "uint256",
                      name: "nasmgPaidOutRewards",
                      type: "uint256",
                    },
                    {
                      internalType: "uint256",
                      name: "diboPaidOutRewards",
                      type: "uint256",
                    },
                  ],
                  stateMutability: "view",
                  type: "function",
                },
                {
                  inputs: [],
                  name: "lockPeriod",
                  outputs: [
                    { internalType: "uint256", name: "", type: "uint256" },
                  ],
                  stateMutability: "view",
                  type: "function",
                },
                {
                  inputs: [],
                  name: "owner",
                  outputs: [
                    { internalType: "address", name: "", type: "address" },
                  ],
                  stateMutability: "view",
                  type: "function",
                },
                {
                  inputs: [
                    {
                      internalType: "uint256",
                      name: "_newInterest",
                      type: "uint256",
                    },
                  ],
                  name: "setDiboInterest",
                  outputs: [{ internalType: "bool", name: "", type: "bool" }],
                  stateMutability: "nonpayable",
                  type: "function",
                },
                {
                  inputs: [
                    {
                      internalType: "uint256",
                      name: "_newInterest",
                      type: "uint256",
                    },
                  ],
                  name: "setNasmgInterest",
                  outputs: [{ internalType: "bool", name: "", type: "bool" }],
                  stateMutability: "nonpayable",
                  type: "function",
                },
                {
                  inputs: [],
                  name: "totalValueLocked",
                  outputs: [
                    { internalType: "uint256", name: "", type: "uint256" },
                  ],
                  stateMutability: "view",
                  type: "function",
                },
                {
                  inputs: [],
                  name: "withdraw",
                  outputs: [],
                  stateMutability: "nonpayable",
                  type: "function",
                },
              ],
              "0xb3558421f90985d5209c4eD1c8D292b75f501dEd"
            ),
          90:
            web3Provider &&
            new web3Provider.eth.Contract(
              [
                {
                  inputs: [
                    { internalType: "address", name: "nasmg", type: "address" },
                    { internalType: "address", name: "dibo", type: "address" },
                  ],
                  stateMutability: "nonpayable",
                  type: "constructor",
                },
                {
                  anonymous: false,
                  inputs: [
                    {
                      indexed: true,
                      internalType: "address",
                      name: "user",
                      type: "address",
                    },
                    {
                      indexed: false,
                      internalType: "uint256",
                      name: "amount",
                      type: "uint256",
                    },
                    {
                      indexed: false,
                      internalType: "uint256",
                      name: "timestamp",
                      type: "uint256",
                    },
                    {
                      indexed: false,
                      internalType: "uint256",
                      name: "totalValueLocked",
                      type: "uint256",
                    },
                  ],
                  name: "Deposit",
                  type: "event",
                },
                {
                  anonymous: false,
                  inputs: [
                    {
                      indexed: true,
                      internalType: "address",
                      name: "user",
                      type: "address",
                    },
                    {
                      indexed: false,
                      internalType: "uint256",
                      name: "amount",
                      type: "uint256",
                    },
                    {
                      indexed: false,
                      internalType: "uint256",
                      name: "timestamp",
                      type: "uint256",
                    },
                    {
                      indexed: false,
                      internalType: "uint256",
                      name: "totalValueLocked",
                      type: "uint256",
                    },
                  ],
                  name: "Withdraw",
                  type: "event",
                },
                {
                  inputs: [],
                  name: "claimDiboRewards",
                  outputs: [],
                  stateMutability: "nonpayable",
                  type: "function",
                },
                {
                  inputs: [],
                  name: "claimableRewards",
                  outputs: [
                    { internalType: "uint256", name: "", type: "uint256" },
                  ],
                  stateMutability: "view",
                  type: "function",
                },
                {
                  inputs: [
                    {
                      internalType: "uint256",
                      name: "_amount",
                      type: "uint256",
                    },
                  ],
                  name: "lock",
                  outputs: [],
                  stateMutability: "nonpayable",
                  type: "function",
                },
                {
                  inputs: [
                    { internalType: "address", name: "", type: "address" },
                  ],
                  name: "lockOf",
                  outputs: [
                    { internalType: "address", name: "owner", type: "address" },
                    {
                      internalType: "uint256",
                      name: "lockedAmount",
                      type: "uint256",
                    },
                    {
                      internalType: "uint256",
                      name: "lockTime",
                      type: "uint256",
                    },
                    {
                      internalType: "uint256",
                      name: "lastClaim",
                      type: "uint256",
                    },
                    {
                      internalType: "uint256",
                      name: "nasmgPaidOutRewards",
                      type: "uint256",
                    },
                    {
                      internalType: "uint256",
                      name: "diboPaidOutRewards",
                      type: "uint256",
                    },
                  ],
                  stateMutability: "view",
                  type: "function",
                },
                {
                  inputs: [],
                  name: "lockPeriod",
                  outputs: [
                    { internalType: "uint256", name: "", type: "uint256" },
                  ],
                  stateMutability: "view",
                  type: "function",
                },
                {
                  inputs: [],
                  name: "owner",
                  outputs: [
                    { internalType: "address", name: "", type: "address" },
                  ],
                  stateMutability: "view",
                  type: "function",
                },
                {
                  inputs: [
                    {
                      internalType: "uint256",
                      name: "_newInterest",
                      type: "uint256",
                    },
                  ],
                  name: "setDiboInterest",
                  outputs: [{ internalType: "bool", name: "", type: "bool" }],
                  stateMutability: "nonpayable",
                  type: "function",
                },
                {
                  inputs: [
                    {
                      internalType: "uint256",
                      name: "_newInterest",
                      type: "uint256",
                    },
                  ],
                  name: "setNasmgInterest",
                  outputs: [{ internalType: "bool", name: "", type: "bool" }],
                  stateMutability: "nonpayable",
                  type: "function",
                },
                {
                  inputs: [],
                  name: "totalValueLocked",
                  outputs: [
                    { internalType: "uint256", name: "", type: "uint256" },
                  ],
                  stateMutability: "view",
                  type: "function",
                },
                {
                  inputs: [],
                  name: "withdraw",
                  outputs: [],
                  stateMutability: "nonpayable",
                  type: "function",
                },
              ],
              "0x22F731320d83e5f8BfbBee50413e7756A1DfE528"
            ),
          180:
            web3Provider &&
            new web3Provider.eth.Contract(
              [
                {
                  inputs: [
                    { internalType: "address", name: "nasmg", type: "address" },
                    { internalType: "address", name: "dibo", type: "address" },
                  ],
                  stateMutability: "nonpayable",
                  type: "constructor",
                },
                {
                  anonymous: false,
                  inputs: [
                    {
                      indexed: true,
                      internalType: "address",
                      name: "user",
                      type: "address",
                    },
                    {
                      indexed: false,
                      internalType: "uint256",
                      name: "amount",
                      type: "uint256",
                    },
                    {
                      indexed: false,
                      internalType: "uint256",
                      name: "timestamp",
                      type: "uint256",
                    },
                    {
                      indexed: false,
                      internalType: "uint256",
                      name: "totalValueLocked",
                      type: "uint256",
                    },
                  ],
                  name: "Deposit",
                  type: "event",
                },
                {
                  anonymous: false,
                  inputs: [
                    {
                      indexed: true,
                      internalType: "address",
                      name: "user",
                      type: "address",
                    },
                    {
                      indexed: false,
                      internalType: "uint256",
                      name: "amount",
                      type: "uint256",
                    },
                    {
                      indexed: false,
                      internalType: "uint256",
                      name: "timestamp",
                      type: "uint256",
                    },
                    {
                      indexed: false,
                      internalType: "uint256",
                      name: "totalValueLocked",
                      type: "uint256",
                    },
                  ],
                  name: "Withdraw",
                  type: "event",
                },
                {
                  inputs: [],
                  name: "claimDiboRewards",
                  outputs: [],
                  stateMutability: "nonpayable",
                  type: "function",
                },
                {
                  inputs: [],
                  name: "claimableRewards",
                  outputs: [
                    { internalType: "uint256", name: "", type: "uint256" },
                  ],
                  stateMutability: "view",
                  type: "function",
                },
                {
                  inputs: [
                    {
                      internalType: "uint256",
                      name: "_amount",
                      type: "uint256",
                    },
                  ],
                  name: "lock",
                  outputs: [],
                  stateMutability: "nonpayable",
                  type: "function",
                },
                {
                  inputs: [
                    { internalType: "address", name: "", type: "address" },
                  ],
                  name: "lockOf",
                  outputs: [
                    { internalType: "address", name: "owner", type: "address" },
                    {
                      internalType: "uint256",
                      name: "lockedAmount",
                      type: "uint256",
                    },
                    {
                      internalType: "uint256",
                      name: "lockTime",
                      type: "uint256",
                    },
                    {
                      internalType: "uint256",
                      name: "lastClaim",
                      type: "uint256",
                    },
                    {
                      internalType: "uint256",
                      name: "nasmgPaidOutRewards",
                      type: "uint256",
                    },
                    {
                      internalType: "uint256",
                      name: "diboPaidOutRewards",
                      type: "uint256",
                    },
                  ],
                  stateMutability: "view",
                  type: "function",
                },
                {
                  inputs: [],
                  name: "lockPeriod",
                  outputs: [
                    { internalType: "uint256", name: "", type: "uint256" },
                  ],
                  stateMutability: "view",
                  type: "function",
                },
                {
                  inputs: [],
                  name: "owner",
                  outputs: [
                    { internalType: "address", name: "", type: "address" },
                  ],
                  stateMutability: "view",
                  type: "function",
                },
                {
                  inputs: [
                    {
                      internalType: "uint256",
                      name: "_newInterest",
                      type: "uint256",
                    },
                  ],
                  name: "setDiboInterest",
                  outputs: [{ internalType: "bool", name: "", type: "bool" }],
                  stateMutability: "nonpayable",
                  type: "function",
                },
                {
                  inputs: [
                    {
                      internalType: "uint256",
                      name: "_newInterest",
                      type: "uint256",
                    },
                  ],
                  name: "setNasmgInterest",
                  outputs: [{ internalType: "bool", name: "", type: "bool" }],
                  stateMutability: "nonpayable",
                  type: "function",
                },
                {
                  inputs: [],
                  name: "totalValueLocked",
                  outputs: [
                    { internalType: "uint256", name: "", type: "uint256" },
                  ],
                  stateMutability: "view",
                  type: "function",
                },
                {
                  inputs: [],
                  name: "withdraw",
                  outputs: [],
                  stateMutability: "nonpayable",
                  type: "function",
                },
              ],
              "0xCF9d4DC5234034E094036E02225203596C75886d"
            ),
          365:
            web3Provider &&
            new web3Provider.eth.Contract(
              [
                {
                  inputs: [
                    { internalType: "address", name: "nasmg", type: "address" },
                    { internalType: "address", name: "dibo", type: "address" },
                  ],
                  stateMutability: "nonpayable",
                  type: "constructor",
                },
                {
                  anonymous: false,
                  inputs: [
                    {
                      indexed: true,
                      internalType: "address",
                      name: "user",
                      type: "address",
                    },
                    {
                      indexed: false,
                      internalType: "uint256",
                      name: "amount",
                      type: "uint256",
                    },
                    {
                      indexed: false,
                      internalType: "uint256",
                      name: "timestamp",
                      type: "uint256",
                    },
                    {
                      indexed: false,
                      internalType: "uint256",
                      name: "totalValueLocked",
                      type: "uint256",
                    },
                  ],
                  name: "Deposit",
                  type: "event",
                },
                {
                  anonymous: false,
                  inputs: [
                    {
                      indexed: true,
                      internalType: "address",
                      name: "user",
                      type: "address",
                    },
                    {
                      indexed: false,
                      internalType: "uint256",
                      name: "amount",
                      type: "uint256",
                    },
                    {
                      indexed: false,
                      internalType: "uint256",
                      name: "timestamp",
                      type: "uint256",
                    },
                    {
                      indexed: false,
                      internalType: "uint256",
                      name: "totalValueLocked",
                      type: "uint256",
                    },
                  ],
                  name: "Withdraw",
                  type: "event",
                },
                {
                  inputs: [],
                  name: "claimDiboRewards",
                  outputs: [],
                  stateMutability: "nonpayable",
                  type: "function",
                },
                {
                  inputs: [],
                  name: "claimableRewards",
                  outputs: [
                    { internalType: "uint256", name: "", type: "uint256" },
                  ],
                  stateMutability: "view",
                  type: "function",
                },
                {
                  inputs: [
                    {
                      internalType: "uint256",
                      name: "_amount",
                      type: "uint256",
                    },
                  ],
                  name: "lock",
                  outputs: [],
                  stateMutability: "nonpayable",
                  type: "function",
                },
                {
                  inputs: [
                    { internalType: "address", name: "", type: "address" },
                  ],
                  name: "lockOf",
                  outputs: [
                    { internalType: "address", name: "owner", type: "address" },
                    {
                      internalType: "uint256",
                      name: "lockedAmount",
                      type: "uint256",
                    },
                    {
                      internalType: "uint256",
                      name: "lockTime",
                      type: "uint256",
                    },
                    {
                      internalType: "uint256",
                      name: "lastClaim",
                      type: "uint256",
                    },
                    {
                      internalType: "uint256",
                      name: "nasmgPaidOutRewards",
                      type: "uint256",
                    },
                    {
                      internalType: "uint256",
                      name: "diboPaidOutRewards",
                      type: "uint256",
                    },
                  ],
                  stateMutability: "view",
                  type: "function",
                },
                {
                  inputs: [],
                  name: "lockPeriod",
                  outputs: [
                    { internalType: "uint256", name: "", type: "uint256" },
                  ],
                  stateMutability: "view",
                  type: "function",
                },
                {
                  inputs: [],
                  name: "owner",
                  outputs: [
                    { internalType: "address", name: "", type: "address" },
                  ],
                  stateMutability: "view",
                  type: "function",
                },
                {
                  inputs: [
                    {
                      internalType: "uint256",
                      name: "_newInterest",
                      type: "uint256",
                    },
                  ],
                  name: "setDiboInterest",
                  outputs: [{ internalType: "bool", name: "", type: "bool" }],
                  stateMutability: "nonpayable",
                  type: "function",
                },
                {
                  inputs: [
                    {
                      internalType: "uint256",
                      name: "_newInterest",
                      type: "uint256",
                    },
                  ],
                  name: "setNasmgInterest",
                  outputs: [{ internalType: "bool", name: "", type: "bool" }],
                  stateMutability: "nonpayable",
                  type: "function",
                },
                {
                  inputs: [],
                  name: "totalValueLocked",
                  outputs: [
                    { internalType: "uint256", name: "", type: "uint256" },
                  ],
                  stateMutability: "view",
                  type: "function",
                },
                {
                  inputs: [],
                  name: "withdraw",
                  outputs: [],
                  stateMutability: "nonpayable",
                  type: "function",
                },
              ],
              "0xbF1c086929dFdf3F2CA0D46bdf7BE170c2789590"
            ),
        },
      });
  }, [address]);

  useEffect(() => {
    contracts && getBlockchainData();
  }, [contracts]);

  async function getBlockchainData() {
    try {
      Object.keys(periods).forEach(async (key) => {
        const lockOf = await contracts?.lock[key].methods
          .lockOf(address)
          .call();
        setLockOf((prevState) => {
          return { ...prevState, [`${key}`]: lockOf };
        });
      });
    } catch (e) {
      console.log(e);
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

  return (
    <>
      {address && (
        <div className={styles.separator}>
          <h3 className={styles.title}>Existing Locks ({address})</h3>
          <span
            className={styles.line}
            style={{ borderBottom: "4px #81c9e9 solid" }}
          ></span>
        </div>
      )}
      <section className={styles.accordion}>
        {Object.keys(periods).map(
          (key) =>
            lockOf[key]?.lockedAmount !== "0" &&
            address && (
              <div
                className={`${styles.stakingSection} glass`}
                key={periods[key].period}
              >
                <span className={styles.label}>LOCK</span>
                <div className={styles.flex}>
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
                    <p className={styles.amount}></p>
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
                  ></button>
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
                <div className={styles.depositContainer}>
                  <div className={styles.inputArea}>
                    <div className={styles.depWitButtons}>
                      <button
                        className={styles.button}
                        style={{ backgroundColor: "#6d76b2", width: "100%" }}
                      >
                        Withdraw
                      </button>
                    </div>
                    <p>your NASMG</p>

                    <input
                      type="number"
                      className={styles.formInput}
                      value={
                        web3Provider && lockOf[key]
                          ? web3Provider.utils.fromWei(
                              lockOf[key].lockedAmount,
                              "ether"
                            )
                          : ""
                      }
                      style={{ textAlign: "left" }}
                      disabled
                    />

                    {Number(lockOf[key]?.lockTime) +
                      Number(periods[key]?.lockPeriod) >
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
                        value={"Unlock & Claim"}
                        style={{ margin: "0" }}
                        onclick={withdraw}
                      />
                    )}
                  </div>
                </div>
              </div>
            )
        )}
      </section>
    </>
  );
}
