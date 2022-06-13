import Link from "next/link";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/router";
import { useAppContext } from "../../Contexts";
import styles from "./Navigation.module.scss";
import LanguageDropdown from "./LanguageDropdown";
import SNSLinks from "./SNSLinks";
import { fnLoader } from "../../Utils/WithDynamicLoader";
import { logo, dashboard, stake, swap, hourglass } from "../../assets/exports";
import Button from "../Reusables/Button";
export default function Navigation(props) {
  const { appState, dispatch } = useAppContext();
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <>
      <nav
        className={`${styles.navbar} ${props.mobNav ? styles.navbarOpen : ""}`}
        style={appState.loading ? { cursor: "wait" } : null}
      >
        <div className={styles.logo}></div>
        <div
          className={styles.logoImg}
          onClick={props.mobNav ? () => props.setMobNav(false) : null}
        >
          <Link href="/">
            <a>
              <Image
                src={logo.src}
                width={logo.width}
                height={logo.height}
                className={styles.logoImg}
              />
            </a>
          </Link>
        </div>
        <ul
          className={styles.navbarNav}
          style={appState.loading ? { pointerEvents: "none" } : null}
        >
          {/* DASHBOARD */}
          <li
            className={styles.navItem}
            onClick={props.mobNav ? () => props.setMobNav(false) : null}
          >
            <Link href="/">
              <a
                className={`${styles.navLink}  ${
                  router.pathname === "/" ? styles.navLinkActive : ""
                }`}
              >
                <Image src={dashboard.src} width={20} height={21} />
                <span className={styles.linkText}>{t("dashboard")}</span>
              </a>
            </Link>
          </li>
          {/* STAKE */}
          {/* 
          
          */}
          <li
            className={styles.navItem}
            onClick={props.mobNav ? () => props.setMobNav(false) : null}
          >
            <Link href="/stake">
              <a
                className={`${styles.navLink}  ${
                  router.pathname === "/stake" ? styles.navLinkActive : ""
                }`}
              >
                <Image src={stake.src} width={24} height={30} />
                <span className={styles.linkText}>{t("stake")}</span>
              </a>
            </Link>
          </li>
          {/* SWAP */}
          <li
            className={styles.navItem}
            onClick={props.mobNav ? () => props.setMobNav(false) : null}
          >
            <Link href="/swap">
              <a
                className={`${styles.navLink}  ${
                  router.pathname === "/swap" ? styles.navLinkActive : ""
                }`}
              >
                <Image src={swap.src} width={24} height={26} />
                <span className={styles.linkText}>{t("swap")}</span>
              </a>
            </Link>
          </li>
          {/* HOURGLASS */}
          {/* <li
            className={styles.navItem}
            onClick={props.mobNav ? () => props.setMobNav(false) : null}
          >
            <Link href="/hourglass">
              <a
                className={`${styles.navLink}  ${
                  router.pathname === "/hourglass" ? styles.navLinkActive : ""
                }`}
              >
                <Image src={hourglass.src} width={29} height={30} />
                <span className={styles.linkText}>{t("hourglass")}</span>
              </a>
            </Link>
          </li> */}
          <li></li>
        </ul>
        <LanguageDropdown appState={appState} dispatch={dispatch} />
        {/* <SNSLinks /> */}
      </nav>
      {props.mobNav ? (
        <div
          className={styles.close}
          onClick={() => props.setMobNav(false)}
        ></div>
      ) : null}
    </>
  );
}
