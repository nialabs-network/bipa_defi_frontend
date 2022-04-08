import React, {
  createContext,
  useReducer,
  useContext,
  useLayoutEffect,
  useRef,
} from "react";
import { appInitialState, appReducer, APP_ACTIONS } from "../Reducers";
import i18n from "../languages/i18n";
import { toast } from "react-toastify";

const AppContext = createContext(appInitialState);

function AppContextProvider({ children, Language }) {
  console.log("________________app context_________________");
  const [appState, dispatch] = useReducer(appReducer, {
    ...appInitialState,
    language: Language ? Language : appInitialState.language,
  });
  const firstRender = useRef(true);
  console.log("first render:", firstRender.current);
  if (firstRender.current) {
    /**
     * LANGUAGE SETTING
     * THIS IS ONLY FOR THE FIRST RENDER
     * THIS WILL REFLECT PAGE SOURCE ONLY
     */
    if (typeof window === "undefined") {
      //server side
      console.log("changing html lang on server");
      i18n.changeLanguage(appState.language);
    } else {
      //client side
      if (appState.language !== i18n.language) {
        //syncing ssr and csr
        console.log("syncing client with back");
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
  useLayoutEffect(() => {
    console.log("_________________useEffect first paint");
    // firstRender.current? firstRender.current = false: i18n.changeLanguage(appState.language);
    //use the line above before production
    // 0x664D3ad1FE12c6e1c08DB506e7f9880EBE253d96
    if (firstRender.current) {
      console.log("setting first render to false");
      firstRender.current = false;
    } else {
      console.log("USE EFFECT FOR LANGUAGE SETTING");
      toast.info("[DEV]Reload the page for better SEO");
      i18n.changeLanguage(appState.language);
    }
  }, [appState.language]);
  console.log(appState, "app state");
  console.log("isloading:", appState.loading);

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

/**
 *
 */
