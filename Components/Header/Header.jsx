import { useWeb3Context } from "../../Contexts";
import styles from "./Header.module.scss";
import Button from "../Reusables/Button";
import Image from "next/image";
import Link from "next/link";
import { wallet, logoMob, hamburger } from "../../assets/exports";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

export default function Header() {
  const { web3State } = useWeb3Context();
  const { t } = useTranslation();
  const { address, connect, disconnect } = web3State;
  console.log("_____________HEADER RENDER____________________");
  const [windowWidth, setWindowWidth] = useState(1024);
  const isDesktop = windowWidth > 768;
  useEffect(() => {
    setWindowWidth(window.innerWidth);
    window.addEventListener("resize", () => {
      setWindowWidth(window.innerWidth);
    });
    return window.removeEventListener("rezise", () => {
      setWindowWidth(window.innerWidth);
    });
  }, []);
  function openNavBar() {
    console.log("iwill");
  }
  return (
    <header>
      <div className={styles.header}>
        {isDesktop ? (
          // PC VERSION
          <>
            {address ? (
              <div className={styles.address}>
                <Button value={"todo"} />
              </div>
            ) : null}
            <div className={styles.buttonPC}>
              <Button
                value={address ? t("disconnectWallet") : t("connectWallet")}
                onclick={address ? () => disconnect() : () => connect(false)}
                style={{ width: "13rem" }}
              />
            </div>
          </>
        ) : (
          // MOBILE VERSION
          <>
            <span className={styles.hamburger} onClick={openNavBar}>
              <Image
                src={hamburger}
                width={hamburger.width}
                height={hamburger.height}
              />
            </span>
            <div className={styles.logoMob}>
              <Link href="/">
                <a>
                  <Image
                    src={logoMob}
                    width={logoMob.width}
                    height={logoMob.height}
                  />
                </a>
              </Link>
            </div>

            <div className={styles.buttonMob}>
              <Button
                value={<Image src={wallet} width={40} height={40} />}
                onclick={address ? () => disconnect() : () => connect(false)}
                style={{ padding: "0", lineHeight: "0" }}
              />
            </div>
          </>
        )}
      </div>
    </header>
  );
}
