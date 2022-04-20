export default function Stats({ styles }) {
  return (
    <section className={`${styles.stats} glass`}>
      <div className={styles.stat}>
        <h3 className={styles.title}>Market Cap</h3>
        <p className={styles.value}>$53,837,658</p>
      </div>
      <div className={styles.stat}>
        <h3 className={styles.title}>NASMG Price</h3>
        <p className={styles.value}>$52.90</p>
      </div>
      <div className={styles.stat}>
        <h3 className={styles.title}>wsNASMG Price</h3>
        <p className={styles.value}>$52.90</p>
      </div>
      <div className={styles.stat}>
        <h3 className={styles.title}>APY</h3>
        <p className={styles.value}>90,210.7%</p>
      </div>
      <div className={styles.stat}>
        <h3 className={styles.title}>Backing per $NASMG</h3>
        <p className={styles.value}>$30</p>
      </div>
      <div className={styles.stat}>
        <h3 className={styles.title}>Current Index</h3>
        <p className={styles.value}>25.60 NASMG</p>
      </div>
    </section>
  );
}
