import { useAppContext, useWeb3Context } from "../../Contexts";
import styles from "./Header.module.scss";

export default function Header() {
  const { appState } = useAppContext();
  const { web3State } = useWeb3Context();
  console.log("_____________HEADER RENDER____________________");
  return (
    <header>
      <div className={styles.header}>
        <button
          className={styles.button}
          onClick={web3State.address ? web3State.disconnect : web3State.connect}
        >
          {web3State.address ? web3State.address : "connect"}
        </button>
      </div>
    </header>
  );
}
