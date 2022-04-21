import { useWeb3Context } from "../../Contexts";
import styles from "./Header.module.scss";
import Button from "../Reusables/Button";

export default function Header() {
  const { web3State } = useWeb3Context();
  const { address, connect, disconnect } = web3State;
  console.log("_____________HEADER RENDER____________________");
  return (
    <header>
      <div className={styles.header}>
        <Button
          value={address ? "Disconnect wallet" : "Connect wallet"}
          onclick={address ? () => disconnect() : () => connect(false)}
          style={{ width: "13rem" }}
        />
      </div>
    </header>
  );
}
