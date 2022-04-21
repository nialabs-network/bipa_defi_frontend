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

export const useWeb3 = () => {
  console.log("___________________useWeb3______________________");
  const [web3State, dispatch] = useReducer(web3Reducer, web3InitialState);
  const { provider, web3Provider, address, balance, network, contract } =
    web3State;
  const { t } = useTranslation();
  const appContext = useAppContext();
  /**
   * CONNECTING TO METAMASK
   */
  const connect = useCallback(async (isReconnecting) => {
    console.log("__________connect function strikes in_______________");
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
        const contract = null;
        console.log("now dispatching");
        dispatch({
          type: WEB3ACTIONS.SET_WEB3_PROVIDER,
          provider,
          web3Provider,
          address: address[0],
          network,
          balance,
          contract,
        });
        console.log("dispatched");
        console.log(isReconnecting, "is reconnecting");
        isReconnecting
          ? toast.success("[DEV]Connection is stable")
          : toast.success(t("wallet_connect_toast"));
        localStorage.setItem("WEB3_CONNECT_CACHED_PROVIDER", "injected");
        appContext.setLoadingState(false, "");
      } catch (e) {
        console.error(e);
        toast.error("Open your wallet");
        setTimeout(() => {
          appContext.setLoadingState(false, "");
        }, 751);
      }
    } else {
      console.error("window is not defined");
    }
  }, []);
  /**
   * DISCONNECTING FROM METAMASK
   */
  const disconnect = useCallback(async () => {
    console.log("__________disconnect function strikes in_______________");
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
  /**
   * IF CACHE IS THERE, CONNECTION TO THE WALLET IS ESTABLISHED RIGHT AFTER REFRESH
   */
  useEffect(() => {
    console.log("__________reconnect effect_______________");
    console.log("first render:", appContext.firstRender.current);
    if (
      window.ethereum &&
      localStorage.getItem("WEB3_CONNECT_CACHED_PROVIDER")
    ) {
      const isReconnecting = true;
      connect(isReconnecting);
    }
  }, []);
  //EIP-1193 events handler
  useEffect(() => {
    console.log("__________account change effect_______________");
    console.log(
      "first render acc change effect:",
      appContext.firstRender.current
    );
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
  console.log("returning from web3-_------___---");
  console.log(contract);
  return {
    provider,
    web3Provider,
    address,
    balance,
    network,
    contract,
    connect,
    disconnect,
    dispatch,
  };
};
