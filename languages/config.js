import translationsEn from "./translationsEn.json";
import translationsKo from "./translationsKo.json";

const resources = {
  "en-US": { translation: translationsEn },
  "ko-KR": { translation: translationsKo },
};
const config = {
  resources,
  lng: "en-US", //change default language
  fallbackLng: "en-US",
  interpolation: { escapeValue: false },
};
export default config;
