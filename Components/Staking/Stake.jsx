import { nasmgLogo } from "../../assets/exports";
import { diboLogo } from "../../assets/exports";
import Image from "next/image";
export default function Stake({ styles }) {
  return (
    <section
      className={`${styles.stakingSection} glass`}
      style={{ border: "3px solid #cdabef" }}
    >
      <span className={styles.label} style={{ backgroundColor: "#cdabef" }}>
        STAKE
      </span>
      <div className={styles.flex}>
        <div className={styles.logo}>
          <div className={styles.stakeLogo}>
            <Image
              src={nasmgLogo}
              width={nasmgLogo.width}
              height={nasmgLogo.height}
            />
          </div>
          <div className={styles.stakeLogo}>
            <Image
              src={diboLogo}
              width={diboLogo.width}
              height={diboLogo.height}
            />
          </div>
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
