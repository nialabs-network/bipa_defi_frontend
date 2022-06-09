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

function Web3ContextProvider({ children }) {
  const web3State = useWeb3();
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
function useWeb3Context() {
  return useContext(Web3Context);
}

export { Web3Context, Web3ContextProvider, useWeb3Context };
