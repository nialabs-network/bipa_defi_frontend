import config from "../languages/config";
const APP_ACTIONS = {
  SET_LANGUAGE: "SET_LANGUAGE",
  SET_LOADING: "SET_LOADING",
};
const appInitialState = {
  language: config.lng,
  loading: false,
  loading_msg: "Loading...",
};
function appReducer(state, action) {
  switch (action.type) {
    case APP_ACTIONS.SET_LANGUAGE:
      return {
        ...state,
        language: action.language,
      };
    case APP_ACTIONS.SET_LOADING:
      return {
        ...state,
        loading: action.loading,
        loading_msg: action.loading_msg,
      };
    default:
      return state;
  }
}

export { APP_ACTIONS, appInitialState, appReducer };
