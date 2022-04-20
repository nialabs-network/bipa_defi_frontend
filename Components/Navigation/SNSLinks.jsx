import styles from "./Navigation.module.scss";
export default function SNSLinks() {
  return (
    <div className={styles.socialMediaLinks}>
      <a href="#">
        <img
          src="https://img.icons8.com/small/344/ffffff/instagram-new.png"
          width={35}
        />
      </a>
      <a href="#">
        <img
          src="https://img.icons8.com/small/344/ffffff/twitter.png"
          width={35}
        />
      </a>
      <a href="#">
        <img
          src="https://img.icons8.com/ios/344/ffffff/youtube-play--v1.png"
          width={35}
        />
      </a>
      <a href="#">
        <img
          src="https://img.icons8.com/ios/344/ffffff/medium--v1.png"
          width={35}
        />
      </a>
    </div>
  );
}
