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
const NASMGAddress = "0xD247C2163D39263a1Ab2391Ad106c534aa3d2A48";
const WMATICAddress = "0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270";
async function getPrice(token, web3Provider) {
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
}

async function swap(token0) {
  const NASMG = await Fetcher.fetchTokenData(137, NASMGAddress);
  const WMATIC = await Fetcher.fetchTokenData(137, WMATICAddress);
  const pair = await Fetcher.fetchPairData(NASMG, WMATIC);
  const route = new Route([pair], token0.ticker == "NASMG" ? NASMG : WMATIC);

  const slippageTolerance = new Percent("50", "10000");
  console.log(slippageTolerance);
}

export { getPrice, swap };
