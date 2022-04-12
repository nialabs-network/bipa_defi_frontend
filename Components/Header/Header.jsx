import { useAppContext, useWeb3Context } from "../../Contexts";
import styles from "./Header.module.scss";

export default function Header() {
  const { web3State } = useWeb3Context();
  const address = web3State.address;
  console.log("_____________HEADER RENDER____________________");
  return (
    <header>
      <div className={styles.header}>
        <button
          className={styles.button}
          onClick={web3State.address ? web3State.disconnect : web3State.connect}
        >
          {address
            ? address.slice(0, 8) + "..." + address.slice(37)
            : "Connect Wallet"}
        </button>
      </div>
    </header>
  );
}
