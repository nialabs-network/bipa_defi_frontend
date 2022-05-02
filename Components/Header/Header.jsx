import { useWeb3Context } from "../../Contexts";
import styles from "./Header.module.scss";
import Button from "../Reusables/Button";
import Image from "next/image";
import Link from "next/link";
import { wallet, logoMob, hamburger, copy } from "../../assets/exports";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

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
  async function copyAddress() {
    // if (navigator.clipboard) return;
    // const clipboard = navigator.clipboard;
    // return await clipboard.writeText(user.account);
    await navigator.clipboard.writeText(address);
    toast.success("Your address is copied");
  }
  return (
    <header>
      <div className={styles.header}>
        {isDesktop ? (
          // PC VERSION
          <>
            {address ? (
              <div className={styles.address} onClick={copyAddress}>
                <Button
                  value={`${address.slice(0, 6) + "..." + address.slice(-4)} `}
                  style={{
                    backgroundColor: "rgba(129, 201, 233, 0.3)",
                    textDecoration: "underline",
                    paddingRight: "40px",
                  }}
                />
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
