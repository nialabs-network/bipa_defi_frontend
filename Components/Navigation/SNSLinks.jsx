import insta from "../../assets/insta.webp";
import youtube from "../../assets/youtube.webp";
import twitter from "../../assets/twitter.webp";
import telegram from "../../assets/telegram.webp";
import medium from "../../assets/medium.webp";
import discord from "../../assets/discord.webp";
import kakao from "../../assets/kakao.webp";
import styles from "./Navigation.module.scss";
import Image from "next/image";
export default function SNSLinks() {
  return (
    <div className={styles.socialMediaLinks}>
      <a href="#">
        <Image src={insta.src} width={24} height={24} />
      </a>
      <a href="#">
        <Image src={youtube.src} width={24} height={24} />
      </a>
      <a href="#">
        <Image src={twitter.src} width={24} height={24} />
      </a>
      <a href="#">
        <Image src={telegram.src} width={24} height={24} />
      </a>
      <a href="#">
        <Image src={medium.src} width={24} height={24} />
      </a>{" "}
      <a href="#">
        <Image src={discord.src} width={24} height={24} />
      </a>
      <a href="#">
        <Image src={kakao.src} width={24} height={24} />
      </a>
    </div>
  );
}
