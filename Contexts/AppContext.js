import React, {
  createContext,
  useReducer,
  useContext,
  useEffect,
  useRef,
} from "react";
import { appInitialState, appReducer, APP_ACTIONS } from "../Reducers";
import i18n from "../languages/i18n";

const AppContext = createContext(appInitialState);

function AppContextProvider({ children, Language }) {
  const [appState, dispatch] = useReducer(appReducer, {
    ...appInitialState,
    language: Language ? Language : appInitialState.language,
  });
  const firstRender = useRef(true);
  if (firstRender.current) {
    if (typeof window === "undefined") {
      //server side
      i18n.changeLanguage(appState.language);
    } else {
      //client side
      if (appState.language !== i18n.language) {
        //syncing ssr and csr
        i18n.changeLanguage(appState.language);
      }
    }
  }
  const setLoadingState = (toggle, message) => {
    dispatch({
      type: APP_ACTIONS.SET_LOADING,
      loading: toggle,
      loading_msg: message,
    });
  };
  useEffect(() => {
    firstRender.current
      ? (firstRender.current = false)
      : i18n.changeLanguage(appState.language);
  }, [appState.language]);
  return (
    <AppContext.Provider
      value={{ appState, firstRender, setLoadingState, dispatch }}
    >
      {children}
    </AppContext.Provider>
  );
}
function useAppContext() {
  return useContext(AppContext);
}

export { AppContext, AppContextProvider, useAppContext };
