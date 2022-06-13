/**
 * Custom web3 hook: useWeb3()
 * Reference from Will Kelly (https://wk0.dev/)
 * Adapted by Alex Yun @ NIALABS
 */
import { useEffect, useReducer, useCallback } from "react";
import Web3 from "web3";
import { WEB3ACTIONS, web3InitialState, web3Reducer } from "../Reducers";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { useAppContext } from "../Contexts";
// import lockAbi from "./lockAbi.js";
// import abi from "./stakeAbi.js";
// import ERC20 from "./erc20.js";
import stakeAbi from "./stakeAbi";
import erc20 from "./erc20";
import lock30Abi from "./lock30Abi";
import lock90Abi from "./lock90Abi";
import lock180Abi from "./lock180Abi";
import lock365Abi from "./lock365Abi";
export const useWeb3 = () => {
  const [web3State, dispatch] = useReducer(web3Reducer, web3InitialState);
  const { provider, web3Provider, address, balance, network, contracts } =
    web3State;
  const { t } = useTranslation();
  const appContext = useAppContext();
  /**
   * CONNECTING TO METAMASK
   */
  const connect = useCallback(async () => {
    appContext.setLoadingState(true, "Connecting...");
    if (window.ethereum) {
      try {
        const provider = window.ethereum; //web3modal can be used if there is a need for more wallets
        const web3Provider = new Web3(provider);
        const address = await provider.request({
          method: "eth_requestAccounts",
        });
        const network = await web3Provider.eth.net.getId();
        const balance = await web3Provider.eth.getBalance(address[0]);
        const contracts = {
          lock: {
            30: new web3Provider.eth.Contract(
              lock30Abi,
              process.env.NEXT_PUBLIC_LOCK30_ADDRESS
            ),
            90: new web3Provider.eth.Contract(
              lock90Abi,
              process.env.NEXT_PUBLIC_LOCK90_ADDRESS
            ),
            180: new web3Provider.eth.Contract(
              lock180Abi,
              process.env.NEXT_PUBLIC_LOCK180_ADDRESS
            ),
            365: new web3Provider.eth.Contract(
              lock365Abi,
              process.env.NEXT_PUBLIC_LOCK365_ADDRESS
            ),
          },
          stake: new web3Provider.eth.Contract(
            stakeAbi,
            process.env.NEXT_PUBLIC_STAKING_ADDRESS
          ),
          NASMG: new web3Provider.eth.Contract(
            erc20,
            process.env.NEXT_PUBLIC_NASMG_ADDRESS
          ),
          DIBO: new web3Provider.eth.Contract(
            erc20,
            process.env.NEXT_PUBLIC_DIBO_ADDRESS
          ),
        };
        dispatch({
          type: WEB3ACTIONS.SET_WEB3_PROVIDER,
          provider,
          web3Provider,
          address: address[0],
          network,
          balance,
          contracts,
        });
        localStorage.setItem("WEB3_CONNECT_CACHED_PROVIDER", "injected");
        appContext.setLoadingState(false, "");
      } catch (e) {
        console.error(e);
        toast.error("Something went wrong. Check you wallet.");
        setTimeout(() => {
          appContext.setLoadingState(false, "");
        }, 751);
      }
    } else {
      appContext.setLoadingState(false, "");
      toast.error("Your browser does not support Metamask");
    }
  }, []);
  /**
   * DISCONNECTING FROM METAMASK
   */
  const disconnect = useCallback(async () => {
    if (window.ethereum) {
      localStorage.removeItem("WEB3_CONNECT_CACHED_PROVIDER");
      if (provider?.disconnect && typeof provider.disconnect === "function") {
        await provider.disconnect();
      }
      dispatch({
        type: WEB3ACTIONS.RESET_WEB3_PROVIDER,
      });
      toast.error("Disconnected from Web3");
    } else {
      console.error("window is not defined");
    }
  }, [provider]);

  useEffect(() => {
    if (
      window.ethereum &&
      localStorage.getItem("WEB3_CONNECT_CACHED_PROVIDER")
    ) {
      connect(); //isReconnecting = true
    }
  }, []);
  //EIP-1193 events handler
  useEffect(() => {
    if (provider?.on) {
      const handleAccountChange = (accounts) => {
        if (accounts.length > 0) {
          dispatch({ type: WEB3ACTIONS.SET_ADDRESS, address: accounts[0] });
          toast.info("Changed Web3 Account");
        } else {
          disconnect();
        }
      };

      // https://docs.ethers.io/v5/concepts/best-practices/#best-practices--network-changes
      const handleChainChanged = (_hexChainId) => {
        if (typeof window !== "undefined") {
          console.log("Switched to chain...", _hexChainId);
          toast.info("Changing the network...");
          window.location.reload();
        } else {
          console.log("Window is undefined");
        }
      };
      const handleDisconnect = ({ code, message }) => {
        console.log("Disconnect", code, message);
        disconnect();
      };

      provider.on("accountsChanged", handleAccountChange);
      provider.on("chainChanged", handleChainChanged);
      provider.on("disconnect", handleDisconnect);

      //Subscription cleanup
      return () => {
        if (provider.removeListener) {
          provider.removeListener("accountsChanged", handleAccountChange);
          provider.removeListener("chainChanged", handleChainChanged);
          provider.removeListener("disconnect", handleDisconnect);
        }
      };
    }
  }, [provider, disconnect]);
  return {
    provider,
    web3Provider,
    address,
    balance,
    network,
    contracts,
    connect,
    disconnect,
    dispatch,
  };
};
