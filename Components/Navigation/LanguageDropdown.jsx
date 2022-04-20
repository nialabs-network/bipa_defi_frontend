import styles from "./Navigation.module.scss";

export default function LanguageDropdown({ appState, dispatch }) {
  const handleLanguageChange = (e) => {
    document.cookie = `Language=${e.target.value}; Max-Age=${24 * 60 * 60}`; //max age in seconds
    dispatch({ type: "SET_LANGUAGE", language: e.target.value });
  };
  return (
    <div className={styles.languageDropdown}>
      <select
        name="language"
        id="language"
        onChange={handleLanguageChange}
        value={appState.language}
      >
        <option value="en-US">English</option>
        <option value="ko-KR">한국어</option>
      </select>
    </div>
  );
}
