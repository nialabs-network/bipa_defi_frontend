import { nasmgLogo, expandArrow } from "../../assets/exports";
import Image from "next/image";
import {
  Accordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemButton,
  AccordionItemPanel,
} from "react-accessible-accordion";
import { fnLoader } from '../../Utils/WithDynamicLoader';

export default function Lock({ styles }) {
  return (
    <>
      <Accordion allowZeroExpanded>
        <AccordionItem>
          <AccordionItemButton className={`${styles.stakingSection} glass`}>
            <span className={styles.label}>BOOST</span>
            <div className={styles.flex}>
              <div className={styles.logo}>
                <div className={styles.stakeLogo}>
                  <Image
                    src={nasmgLogo}
                    loader={fnLoader}
                    width={nasmgLogo.width}
                    height={nasmgLogo.height}
                  />
                </div>
              </div>
              <div className={styles.productTitle}>
                <p className={styles.title}>NASMG Staking</p>
                <p className={styles.amount}>$197,000,000</p>
              </div>
              <div className={styles.productInterest}>
                <p className={styles.interest}>25%</p>
                <p className={styles.apr}>APR 22%</p>
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
              <div className={styles.period}>00 Days</div>
              <button className={styles.accordion}>
                <Image src={expandArrow} loader={fnLoader} width={24} height={24} />
              </button>
            </div>
            <AccordionItemPanel>open</AccordionItemPanel>
          </AccordionItemButton>
        </AccordionItem>
      </Accordion>
    </>
  );
}
