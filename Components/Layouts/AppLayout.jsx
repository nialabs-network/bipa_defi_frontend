import { useAppContext } from "../../Contexts";
import Header from "../Header/Header";
import Navigation from "../Navigation/Navigation";
import styles from "./AppLayout.module.scss";

const LoadingWrapper = ({ isLoading, message, children }) =>
  isLoading ? (
    <>
      <div className={styles.overlay}>{children}</div>
      <div className={styles.loading}>
        <span className={styles.spinner}></span>
        <p>{message}</p>
      </div>
    </>
  ) : (
    children
  );

export default function AppLayout({ children }) {
  const { appState } = useAppContext();
  return (
    <LoadingWrapper isLoading={appState.loading} message={appState.loading_msg}>
      <Header />
      <Navigation />
      <main>{children}</main>
    </LoadingWrapper>
  );
}
