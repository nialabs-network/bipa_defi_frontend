import React, { createContext, useContext, useMemo } from "react";
import { useWeb3 } from "../Hooks";
import { web3InitialState } from "../Reducers";
/**
 * INITIALIZING NEW CONTEXT WITH AN INITIAL STATE
 *
 ***************************************************
  {provider: null,
  web3Provider: null,
  address: null,
  network: null,
  connect: null,
  disconnect: null}
 ****************************************************
Default value is used for components that are out of provider scope
EX: <provider>
      <child1/> this child will get latest updated data
    </provider>
      <child2/> this child will get default value
 */
const Web3Context = createContext(web3InitialState);
/**
 * DATA FLOW
 * CONTEXT(INIT) -> USEWEB3 -> CONTEXT(GET AND RETURN DATA TO CHILDREN) -> CHILDREN RENDER-> DISPATCH -> CONTEXT RERENDER
 */
function Web3ContextProvider({ children }) {
  console.log("______________web3 context______________");
  /**
   * RETRIEVING WEB3 STATE USING useWeb3()
   */
  const web3State = useWeb3();
  console.log("__________web3State________________ now returning");
  console.log(web3State);
  return (
    <Web3Context.Provider value={{ web3State }}>
      {/* provider: null,
          web3Provider: null,
          address: null,
          balance: null
          network: null,
          contract: abi
          connect: null,
          disconnect: null 
      */}
      {children}
    </Web3Context.Provider>
  );
}
/**
 * EXPORTING CONTEXT HOOK
 */
function useWeb3Context() {
  return useContext(Web3Context);
}

export { Web3Context, Web3ContextProvider, useWeb3Context };
