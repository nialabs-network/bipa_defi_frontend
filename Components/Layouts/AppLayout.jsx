import { useAppContext } from "../../Contexts";
import Header from "../Header/Header";
import Navigation from "../Navigation/Navigation";
import styles from "./AppLayout.module.scss";

export default function AppLayout({ children }) {
  const { appState } = useAppContext();
  return (
    <>
      <Header />
      <Navigation />
      <main>
        <div className={styles.container}>{children}</div>
      </main>
      <footer className={styles.footer}>footer</footer>
      {appState.loading ? (
        <div className={styles.loading}>
          <span className={styles.spinner}></span>
          <p>{appState.loading_msg}</p>
        </div>
      ) : null}
    </>
  );
}
