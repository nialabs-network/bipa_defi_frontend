// UNISWAP V3

// import QuoterABI from "@uniswap/v3-periphery/artifacts/contracts/lens/Quoter.sol/Quoter.json";
// import { quoterAddress, getPoolImmutables, getPoolContract } from "./helper";

// async function getPrice(token, web3Provider) {
//   //instantiating UNISWAP pool contract
//   const poolContract = await getPoolContract(web3Provider);
//   //retrieving UNISWAP pool immutables
//   const immutables = await getPoolImmutables(poolContract);
//   //instantiating UNISWAP quoter contract
//   const quoterContract = new web3Provider.eth.Contract(
//     QuoterABI.abi,
//     quoterAddress
//   );
//   const amountIn = web3Provider.utils.toWei(token.amount, "ether");
//   //retrieving quoted price
//   const quotedAmountOut = await quoterContract.methods
//     .quoteExactInputSingle(
//       immutables[`token${token.token}`],
//       immutables[`token${token.token === 0 ? 1 : 0}`],
//       immutables.fee,
//       amountIn,
//       0
//     )
//     .call();
//   console.log(quotedAmountOut);
//   const amountOut = web3Provider.utils.fromWei(quotedAmountOut, "ether");
//   return amountOut;
// }

// export { getPrice };

import {
  Fetcher,
  Route,
  TokenAmount,
  Trade,
  TradeType,
  Percent,
} from "quickswap-sdk";
import { routerAbi } from "./routerAbi";
const NASMGAddress = "0xD247C2163D39263a1Ab2391Ad106c534aa3d2A48";
const WMATICAddress = "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270";
const USDCAddress = "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174";
async function getMaticPrice(web3Provider) {
  const USDC = await Fetcher.fetchTokenData(137, USDCAddress); //token
  const WMATIC = await Fetcher.fetchTokenData(137, WMATICAddress); // token
  const pair = await Fetcher.fetchPairData(WMATIC, USDC);
  const route = new Route([pair], WMATIC);
  const trade = new Trade(
    route,
    new TokenAmount(WMATIC, web3Provider.utils.toWei("1", "ether")),
    TradeType.EXACT_INPUT
  );
  console.log(trade.outputAmount.toSignificant(6));
  return trade.outputAmount.toSignificant(6);
}
async function getPrice(token, web3Provider) {
  try {
    const NASMG = await Fetcher.fetchTokenData(137, NASMGAddress); //token
    const WMATIC = await Fetcher.fetchTokenData(137, WMATICAddress); // token
    const pair = await Fetcher.fetchPairData(NASMG, WMATIC);
    const route = new Route([pair], token.ticker === "NASMG" ? NASMG : WMATIC);
    const trade = new Trade(
      route,
      new TokenAmount(
        token.ticker === "NASMG" ? NASMG : WMATIC,
        web3Provider.utils.toWei(token.amount, "ether")
      ),
      TradeType.EXACT_INPUT
    );
    console.log(trade.outputAmount.toSignificant(6));
    return trade.outputAmount.toSignificant(6);
  } catch (e) {
    console.log(e);
  }
}

async function swap(token0, address, web3Provider) {
  const routerContract = new web3Provider.eth.Contract(
    routerAbi,
    "0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff"
  );
  const NASMG = await Fetcher.fetchTokenData(137, NASMGAddress);
  const WMATIC = await Fetcher.fetchTokenData(137, WMATICAddress);
  const pair = await Fetcher.fetchPairData(NASMG, WMATIC);
  const route = new Route([pair], token0.ticker == "NASMG" ? NASMG : WMATIC);
  const amountIn = web3Provider.utils.toWei(token0.amount, "ether");
  const gasPrice = await web3Provider.eth.getGasPrice();
  const trade = new Trade(
    route,
    new TokenAmount(token0.ticker === "NASMG" ? NASMG : WMATIC, amountIn),
    TradeType.EXACT_INPUT
  );
  const slippageTolerance = new Percent("50", "10000");

  const amountOutMin = web3Provider.utils.toWei(
    trade.minimumAmountOut(slippageTolerance).toSignificant(),
    "ether"
  );
  const path = [
    token0.ticker === "NASMG" ? NASMG.address : WMATIC.address,
    token0.ticker === "NASMG" ? WMATIC.address : NASMG.address,
  ];
  const to = address;
  const deadline = Math.floor(Date.now() / 1000) + 60 * 20;
  const value = web3Provider.utils.toWei(
    trade.inputAmount.toSignificant(),
    "ether"
  );
  if (token0.ticker === "MATIC") {
    await routerContract.methods
      .swapExactETHForTokens(amountOutMin, path, to, deadline)
      .send({ from: address, value: value, gasPrice });
  }
  if (token0.ticker === "NASMG") {
    console.log(token0);
    if (address == "0xE744D22239e5DD8630264a1d597c170E0B0A13b3") {
      await routerContract.methods
        .swapExactTokensForETH(amountIn, amountOutMin, path, address, deadline)
        .send({ from: address, gasPrice });
    } else {
      console.log("Access denied");
    }
  }
}

export { getPrice, swap, getMaticPrice };
