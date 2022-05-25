import styles from "./Hourglass.module.scss";
import Button from "../Reusables/Button";
import Image from "next/image";
import { car, bag, city } from "../../assets/exports";
import { useWeb3Context } from "../../Contexts";
import { default as RCSlider } from "rc-slider";
import { useState, useEffect } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import periods from "../Staking/lockPools";
import stakingPool from "../Staking/stakingPool";
export default function Hourglass() {
  const { web3State } = useWeb3Context();
  const { address, connect, contracts } = web3State;
  const [sliderValue, setSliderValue] = useState(0);
  const [amount, setAmount] = useState("");
  const [target, setTarget] = useState("");
  const [typeOfStake, setTypeOfStake] = useState("staking");
  ///carousel
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <section className={`${styles.container} glass`}>
      <h2 className={styles.pageTitle}>Estimate Your Returns</h2>
      <div className={styles.stats}>
        <div className={styles.price}>
          <h3 className={styles.title}>Current NAMSG Price</h3>
          <p className={styles.value}>$54</p>
        </div>
        <div className={styles.yeild}>
          <h3 className={styles.title}>Current Reward Yield</h3>
          <p className={styles.value}>$54</p>
        </div>
        <div className={styles.balance}>
          <h3 className={styles.title}>NASMG Balance</h3>
          <p className={styles.value}>$54</p>
        </div>
      </div>
      {!address ? (
        <Button
          value="Connect wallet"
          onclick={address ? null : connect}
          style={{ width: "15rem", margin: "1rem auto 1.5rem auto" }}
        />
      ) : (
        <div className={styles.estimateContrainer}>
          <div className={styles.inputContainer}>
            <div className={styles.input}>
              <p className={styles.label}>Future NASMG Market Price</p>
              <select
                name="pool"
                id="pool"
                className={styles.poolDropdown}
                onChange={(e) => {
                  setTypeOfStake(e.target.value);
                  e.target.value !== "staking" &&
                    setSliderValue(periods[e.target.value].period);
                }}
              >
                <option value={stakingPool.period}>{stakingPool.name}</option>
                {Object.keys(periods).map((item, idx) => {
                  return (
                    <option value={periods[item].period} key={idx}>
                      {periods[item].name}
                    </option>
                  );
                })}
              </select>
            </div>
            <div className={styles.input}>
              <p className={styles.label}>NASMG Amount</p>
              <input
                type="number"
                className={styles.formInput}
                onChange={(e) => {
                  setAmount(e.target.value);
                }}
                placeholder="0"
                value={amount}
              />
            </div>
            <div className={styles.input}>
              <p className={styles.label}>Reward Yield(%)</p>
              <input
                type="text"
                className={styles.formInput}
                disabled
                placeholder="0"
                value={Math.round(
                  ((typeOfStake !== "staking"
                    ? periods[typeOfStake].interestPerSecond
                    : stakingPool.interestPerSecond) *
                    60 *
                    24 *
                    365) /
                    10 ** 14
                )}
              />
            </div>
            <div className={styles.input}>
              <p className={styles.label}>Target price</p>
              <input
                type="number"
                className={styles.formInput}
                placeholder="0"
                value={target}
                onChange={(e) => {
                  setTarget(e.target.value);
                }}
              />
            </div>
          </div>
          <div className={styles.figuresContainer}>
            {typeOfStake == "staking" && (
              <RCSlider
                max={365}
                value={sliderValue}
                onChange={(value) => setSliderValue(value)}
              />
            )}
            <p className={styles.days}>{sliderValue} DAYS</p>
            <div className={styles.figures}>
              <div className={styles.figure}>
                <p className={styles.figureTitle}>NASMG Investment</p>
                <p className={styles.figureValue}>{amount || 0}</p>
              </div>
              <div className={styles.figure}>
                <p className={styles.figureTitle}>Dollar value</p>
                <p className={styles.figureValue}>
                  $ {Math.trunc(amount * 0.321 * 100) / 100}
                </p>
              </div>
              <div className={styles.figure}>
                <p className={styles.figureTitle}>NASMG Rewards Estimation</p>
                <p className={styles.figureValue}>
                  {Math.trunc(
                    ((amount *
                      ((typeOfStake == "staking"
                        ? stakingPool.interestPerSecond
                        : periods[typeOfStake].interestPerSecond) /
                        10000000000)) /
                      10000) *
                      sliderValue *
                      100
                  ) / 100}
                </p>
              </div>
              <div className={styles.figure}>
                <p className={styles.figureTitle}>Potential Return</p>
                <p className={styles.figureValue}>
                  {(Math.trunc(
                    ((amount *
                      ((typeOfStake == "staking"
                        ? stakingPool.interestPerSecond
                        : periods[typeOfStake].interestPerSecond) /
                        10000000000)) /
                      10000) *
                      sliderValue *
                      100
                  ) /
                    100) *
                    target}
                </p>
              </div>
            </div>
            <Slider {...settings}>
              <div>
                <div className={styles.carouselItem}>
                  <div className={styles.img}>
                    <Image src={car} />
                  </div>
                  <div>
                    <p className={styles.carouselTitle}>Ferarri</p>
                    <p className={styles.carouselDesc}>
                      Ferarri 8 12 superfast no option
                    </p>
                  </div>
                </div>
              </div>
              <div>
                <div className={styles.carouselItem}>
                  <div className={styles.img}>
                    <Image src={city} />
                  </div>
                  <div>
                    <p className={styles.carouselTitle}>Banpo Xi(s)</p>
                    <p className={styles.carouselDesc}>
                      Banpo Xi Apartment 116 sqrm
                    </p>
                  </div>
                </div>
              </div>
              <div>
                <div className={styles.carouselItem}>
                  <div className={styles.img}>
                    <Image src={bag} />
                  </div>
                  <div>
                    <p className={styles.carouselTitle}>Berkin Bag(s)</p>
                    <p className={styles.carouselDesc}>
                      Hermes Berkin 30 Togo Black
                    </p>
                  </div>
                </div>
              </div>
            </Slider>
          </div>
        </div>
      )}
    </section>
  );
}
