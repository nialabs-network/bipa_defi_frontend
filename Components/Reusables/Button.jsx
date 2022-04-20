import styles from "./Reusables.module.scss";
export default function Button({ value, onclick, style }) {
  return (
    <button className={styles.button} onClick={onclick} style={style}>
      {value}
    </button>
  );
}
