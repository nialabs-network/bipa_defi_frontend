import { useAppContext } from "../../Contexts";
import Header from "../Header/Header";
import Navigation from "../Navigation/Navigation";
import styles from "./AppLayout.module.scss";
import { loading } from "../../assets/exports";
import Image from "next/image";
import { useState } from "react";
import { motion } from "framer-motion";
export default function AppLayout({ children }) {
  const { appState } = useAppContext();
  const [mobNav, setMobNav] = useState(false);
  return (
    <>
      <Header mobNav={mobNav} setMobNav={setMobNav} />
      <Navigation mobNav={mobNav} setMobNav={setMobNav} />
      <main>
        <div className={styles.container}>{children}</div>
      </main>
      <footer className={styles.footer}>
        <div className={styles.banner}>Ad banner</div>
      </footer>
      {appState.loading ? (
        <motion.div
          initial="initial"
          animate="animate"
          variants={{
            initial: { opacity: 0 },
            animate: { opacity: 1 },
          }}
          transition={{ duration: 0.1 }}
        >
          <div className={styles.overlay}>
            <div className={styles.loading}>
              {/* <span className={styles.spinner}></span> */}
              <Image
                src={loading}
                // loader={fnLoader}
                width={loading.width}
                height={loading.height}
              />
              <p>{appState.loading_msg}</p>
            </div>
          </div>
        </motion.div>
      ) : null}
    </>
  );
}
