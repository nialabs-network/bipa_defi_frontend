import { nasmgLogo, diboLogo, expandArrow } from "../../assets/exports";
import Button from "../Reusables/Button";
import Image from "next/image";
import { useState } from "react";

export default function Lock({
  styles,
  toggle,
  selected,
  nasmgBalance,
  lock,
  withdraw,
}) {
  const periods = ["30days", "90days", "180days", "365days"];
  const [amount, setAmount] = useState("");

  return (
    <section className={styles.accordion}>
      {periods.map((period) => (
        <div className={`${styles.stakingSection} glass`} key={period}>
          <span className={styles.label}>LOCK</span>
          <div className={styles.flex} onClick={() => toggle(period)}>
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
              <p className={styles.interest}>25%</p>
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
              {period.slice(0, 3)[2] == "d"
                ? period.slice(0, 2)
                : period.slice(0, 3)}{" "}
              Days
            </div>
            <button
              className={styles.accordion_button}
              style={
                selected == period ? { transform: "rotate(180deg)" } : null
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
            style={selected !== period ? { display: "none" } : null}
          >
            <div className={styles.inputArea}>
              {/* <div className={styles.depWitButtons}>
              <button
                className={`${styles.button}`}
                style={{ backgroundColor: "#6d76b2" }}
              >
                Deposit
              </button>
              <button className={styles.button}>Withdraw</button>
            </div> */}
              <p>0.5% fee for witdrawals within 3 days</p>
              <input
                type="text"
                className={styles.formInput}
                placeholder="0"
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value);
                }}
                style={{ textAlign: "left" }}
              />
              <div className={styles.depositWalletBal}>
                <p>Wallet Balance:</p>
                <div>
                  <span style={{ display: "block" }}>NASMG</span>
                  <span style={{ display: "block", textAlign: "right" }}>
                    {nasmgBalance}
                  </span>
                </div>
              </div>
              <Button
                value="Lock"
                style={{ margin: "0" }}
                onclick={() => lock(amount)}
              />
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
                  <p>0</p>
                  <p>NASMG</p>
                </div>
              </div>
              <div className={styles.rewards}>
                <p className={styles.title}>Estimated Rewards</p>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <p>0</p>
                  <p style={{ textAlign: "right" }}>DIBO</p>
                </div>
              </div>
              <Button
                value="Withdraw"
                onclick={withdraw}
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
      ))}
    </section>
  );
}
