import { nasmgLogo, diboLogo, expandArrow } from "../../assets/exports";
import Image from "next/image";
import Button from "../../Components/Reusables/Button";
import {
  Accordion,
  AccordionItem,
  AccordionItemButton,
  AccordionItemPanel,
} from "react-accessible-accordion";
export default function Stake({ styles }) {
  return (
    <>
      <Accordion allowZeroExpanded>
        <AccordionItem>
          <AccordionItemButton
            className={`${styles.stakingSection} glass`}
            style={{ border: "3px solid #cdabef" }}
          >
            <span
              className={styles.label}
              style={{ backgroundColor: "#cdabef" }}
            >
              STAKE
            </span>{" "}
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
              <div className={styles.period}>00 Days</div>
              <button className={`${styles.accordion} accordion__button`}>
                <Image src={expandArrow} width={24} height={24} />
              </button>
            </div>
            <AccordionItemPanel>
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
                      className={`${styles.button}`}
                      style={{ backgroundColor: "#6d76b2" }}
                    >
                      Deposit
                    </button>
                    <button className={styles.button}>Withdraw</button>
                  </div>
                  <p>0.5% fee for witdrawals within 3 days</p>
                  <input
                    type="text"
                    className={styles.formInput}
                    placeholder="0"
                    style={{ textAlign: "left" }}
                  />
                  <div className={styles.depositWalletBal}>
                    <p>Wallet Balance:</p>
                    <div>
                      <span style={{ display: "block" }}>NASMG - DIBO LP</span>
                      <span style={{ display: "block", textAlign: "right" }}>
                        $0
                      </span>
                    </div>
                  </div>
                  <Button value="Deposit" style={{ margin: "0" }} />
                </div>

                <div className={styles.infoArea}>
                  <div className={styles.apr}>
                    <p className={styles.title}>APR</p>
                    <p>70%</p>
                  </div>
                  <div className={styles.deposit}>
                    <p className={styles.title}>Deposit</p>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <p>0</p>
                      <p>NASMG-DIBO LP</p>
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
                      <p>0</p>
                      <p style={{ textAlign: "right" }}>DIBO</p>
                    </div>
                  </div>
                  <Button
                    value="Unstake"
                    style={{
                      backgroundColor: "transparent",
                      outline: "solid 2px #81c9e9",
                      marginBottom: "0px",
                      marginTop: "0px",
                    }}
                  />
                </div>
              </div>
            </AccordionItemPanel>
          </AccordionItemButton>
        </AccordionItem>
      </Accordion>
    </>
  );
}
