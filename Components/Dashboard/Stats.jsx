export default function Stats({ styles }) {
  return (
    <section className={`${styles.stats} ${styles.glass}`}>
      <div className={`${styles.stat} ${styles.glassMob}`}>
        <p className={styles.title}>Market Cap</p>
        <p className={styles.value}>$53,837,658</p>
      </div>
      <div className={`${styles.stat} ${styles.glassMob}`}>
        <p className={styles.title}>NASMG Price</p>
        <p className={styles.value}>$52.90</p>
      </div>
      <div className={`${styles.stat} ${styles.glassMob}`}>
        <p className={styles.title}>wsNASMG Price</p>
        <p className={styles.value}>$52.90</p>
      </div>
      <div className={`${styles.stat} ${styles.glassMob}`}>
        <p className={styles.title}>APY</p>
        <p className={styles.value}>90,210.7%</p>
      </div>
      <div className={`${styles.stat} ${styles.glassMob}`}>
        <p className={styles.title}>Backing per $NASMG</p>
        <p className={styles.value}>$30</p>
      </div>
      <div className={`${styles.stat} ${styles.glassMob}`}>
        <p className={styles.title}>Current Index</p>
        <p className={styles.value}>25.60 NASMG</p>
      </div>
    </section>
  );
}
