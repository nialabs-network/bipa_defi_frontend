/**
 * ACTION TYPES
 */
const WEB3ACTIONS = {
  SET_WEB3_PROVIDER: "SET_WEB3_PROVIDER",
  SET_ADDRESS: "SET_ADDRESS",
  SET_NETWORK: "SET_NETWORK",
  RESET_WEB3_PROVIDER: "RESET_WEB3_PROVIDER",
  LOAD_CONTRACT: "LOAD_CONTRACT",
};
/**
 * INITIAL WEB3 STATE
 */
const web3InitialState = {
  provider: null,
  web3Provider: null,
  address: null, //when Metamask is injected address is undefined until the specific address is connected
  balance: null,
  network: null,
  contracts: undefined,
  connect: null, //replaced by web3, but stays the same as default context
  disconnect: null, //replaced by web3, but stays the same as default context
};
/**
 * REDUCER FUNCTION
 */
function web3Reducer(state, action) {
  switch (action.type) {
    case WEB3ACTIONS.SET_WEB3_PROVIDER:
      return {
        ...state,
        provider: action.provider,
        web3Provider: action.web3Provider,
        address: action.address,
        network: action.network,
        balance: action.balance,
        contracts: action.contracts,
      };
    case WEB3ACTIONS.SET_ADDRESS:
      return {
        ...state,
        address: action.address,
      };
    case WEB3ACTIONS.SET_NETWORK:
      return {
        ...state,
        network: action.network,
      };
    case WEB3ACTIONS.RESET_WEB3_PROVIDER:
      return web3InitialState;
    case WEB3ACTIONS.LOAD_CONTRACT:
      return { ...state, contract: action.contract };
    default:
      throw new Error("CANNOT FIND AN ACTION TYPE!");
  }
}

export { WEB3ACTIONS, web3InitialState, web3Reducer };
