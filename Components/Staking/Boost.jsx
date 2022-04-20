export default function Boost({ styles }) {
  return (
    <section className={`${styles.stakingSection} glass`}>
      <span className={styles.boostLabel}>BOOST</span>
      <div className={styles.grid}>
        <div className={styles.logo}>
          <span>logos here </span>
          <span> logos here</span>
        </div>
        <div className={styles.productTitle}>
          <h4>NASMG Staking</h4>
          <p>$197,000,000</p>
        </div>
        <div className={styles.productInterest}>
          <h4>25%</h4>
          <p>APR 22%</p>
        </div>
        <div className={styles.productInfo}>
          <div className={styles.titles}>
            <p>Earn</p>
            <p>Balance</p>
          </div>
          <div className={styles.values}>
            <p>KLAY</p> <p>%0</p>
          </div>
        </div>
      </div>
    </section>
  );
}
