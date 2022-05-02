import { useAppContext } from "../../Contexts";
import Header from "../Header/Header";
import Navigation from "../Navigation/Navigation";
import styles from "./AppLayout.module.scss";
import { loading } from "../../assets/exports";
import Image from "next/image";
import { fnLoader } from '../../Utils/WithDynamicLoader';

export default function AppLayout({ children }) {
  const { appState } = useAppContext();
  return (
    <>
      <Header />
      <Navigation />
      <main>
        <div className={styles.container}>{children}</div>
      </main>
      <footer className={styles.footer}>
        <div className={styles.banner}>Ad banner</div>
      </footer>
      {appState.loading ? (
        <div className={styles.loading}>
          {/* <span className={styles.spinner}></span> */}
          <Image src={loading} loader={fnLoader} width={loading.width} height={loading.height} />
          <p>{appState.loading_msg}</p>
        </div>
      ) : null}
    </>
  );
}
