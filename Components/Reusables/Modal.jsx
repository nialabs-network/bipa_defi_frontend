import styles from "./Reusables.module.scss";
export default function Modal({ content, style }) {
  return (
    <div className={styles.modal} style={style}>
      {content}
    </div>
  );
}
