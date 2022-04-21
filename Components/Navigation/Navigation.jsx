import Link from "next/link";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/router";
import { useAppContext } from "../../Contexts";
import styles from "./Navigation.module.scss";
import LanguageDropdown from "./LanguageDropdown";
import SNSLinks from "./SNSLinks";

import logo from "../../assets/logo.webp";
import dashboard from "../../assets/dashboard.webp";
import stake from "../../assets/stake.webp";
import swap from "../../assets/swap.webp";
import hourglass from "../../assets/hourglass.webp";
export default function Navigation() {
  const { appState, dispatch } = useAppContext();
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <nav
      className={styles.navbar}
      style={appState.loading ? { cursor: "wait" } : null}
    >
      <div className={styles.logo}>
        <Link href="/">
          <a>
            <Image src={logo.src} width={logo.width} height={logo.height} />
          </a>
        </Link>
      </div>
      <ul
        className={styles.navbarNav}
        style={appState.loading ? { pointerEvents: "none" } : null}
      >
        {/* DASHBOARD */}
        <li className={styles.navItem}>
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
        <li className={styles.navItem}>
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
        <li className={styles.navItem}>
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
        <li className={styles.navItem}>
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
        </li>
      </ul>
      <LanguageDropdown appState={appState} dispatch={dispatch} />
      <SNSLinks />
    </nav>
  );
}
