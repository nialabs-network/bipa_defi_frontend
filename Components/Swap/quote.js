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

async function swap(token0, address, web3Provider) {
  const routerContract = new web3Provider.eth.Contract(
    [
      {
        inputs: [
          { internalType: "address", name: "_factory", type: "address" },
          { internalType: "address", name: "_WETH", type: "address" },
        ],
        stateMutability: "nonpayable",
        type: "constructor",
      },
      {
        inputs: [],
        name: "WETH",
        outputs: [{ internalType: "address", name: "", type: "address" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          { internalType: "address", name: "tokenA", type: "address" },
          { internalType: "address", name: "tokenB", type: "address" },
          { internalType: "uint256", name: "amountADesired", type: "uint256" },
          { internalType: "uint256", name: "amountBDesired", type: "uint256" },
          { internalType: "uint256", name: "amountAMin", type: "uint256" },
          { internalType: "uint256", name: "amountBMin", type: "uint256" },
          { internalType: "address", name: "to", type: "address" },
          { internalType: "uint256", name: "deadline", type: "uint256" },
        ],
        name: "addLiquidity",
        outputs: [
          { internalType: "uint256", name: "amountA", type: "uint256" },
          { internalType: "uint256", name: "amountB", type: "uint256" },
          { internalType: "uint256", name: "liquidity", type: "uint256" },
        ],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          { internalType: "address", name: "token", type: "address" },
          {
            internalType: "uint256",
            name: "amountTokenDesired",
            type: "uint256",
          },
          { internalType: "uint256", name: "amountTokenMin", type: "uint256" },
          { internalType: "uint256", name: "amountETHMin", type: "uint256" },
          { internalType: "address", name: "to", type: "address" },
          { internalType: "uint256", name: "deadline", type: "uint256" },
        ],
        name: "addLiquidityETH",
        outputs: [
          { internalType: "uint256", name: "amountToken", type: "uint256" },
          { internalType: "uint256", name: "amountETH", type: "uint256" },
          { internalType: "uint256", name: "liquidity", type: "uint256" },
        ],
        stateMutability: "payable",
        type: "function",
      },
      {
        inputs: [],
        name: "factory",
        outputs: [{ internalType: "address", name: "", type: "address" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          { internalType: "uint256", name: "amountOut", type: "uint256" },
          { internalType: "uint256", name: "reserveIn", type: "uint256" },
          { internalType: "uint256", name: "reserveOut", type: "uint256" },
        ],
        name: "getAmountIn",
        outputs: [
          { internalType: "uint256", name: "amountIn", type: "uint256" },
        ],
        stateMutability: "pure",
        type: "function",
      },
      {
        inputs: [
          { internalType: "uint256", name: "amountIn", type: "uint256" },
          { internalType: "uint256", name: "reserveIn", type: "uint256" },
          { internalType: "uint256", name: "reserveOut", type: "uint256" },
        ],
        name: "getAmountOut",
        outputs: [
          { internalType: "uint256", name: "amountOut", type: "uint256" },
        ],
        stateMutability: "pure",
        type: "function",
      },
      {
        inputs: [
          { internalType: "uint256", name: "amountOut", type: "uint256" },
          { internalType: "address[]", name: "path", type: "address[]" },
        ],
        name: "getAmountsIn",
        outputs: [
          { internalType: "uint256[]", name: "amounts", type: "uint256[]" },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          { internalType: "uint256", name: "amountIn", type: "uint256" },
          { internalType: "address[]", name: "path", type: "address[]" },
        ],
        name: "getAmountsOut",
        outputs: [
          { internalType: "uint256[]", name: "amounts", type: "uint256[]" },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          { internalType: "uint256", name: "amountA", type: "uint256" },
          { internalType: "uint256", name: "reserveA", type: "uint256" },
          { internalType: "uint256", name: "reserveB", type: "uint256" },
        ],
        name: "quote",
        outputs: [
          { internalType: "uint256", name: "amountB", type: "uint256" },
        ],
        stateMutability: "pure",
        type: "function",
      },
      {
        inputs: [
          { internalType: "address", name: "tokenA", type: "address" },
          { internalType: "address", name: "tokenB", type: "address" },
          { internalType: "uint256", name: "liquidity", type: "uint256" },
          { internalType: "uint256", name: "amountAMin", type: "uint256" },
          { internalType: "uint256", name: "amountBMin", type: "uint256" },
          { internalType: "address", name: "to", type: "address" },
          { internalType: "uint256", name: "deadline", type: "uint256" },
        ],
        name: "removeLiquidity",
        outputs: [
          { internalType: "uint256", name: "amountA", type: "uint256" },
          { internalType: "uint256", name: "amountB", type: "uint256" },
        ],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          { internalType: "address", name: "token", type: "address" },
          { internalType: "uint256", name: "liquidity", type: "uint256" },
          { internalType: "uint256", name: "amountTokenMin", type: "uint256" },
          { internalType: "uint256", name: "amountETHMin", type: "uint256" },
          { internalType: "address", name: "to", type: "address" },
          { internalType: "uint256", name: "deadline", type: "uint256" },
        ],
        name: "removeLiquidityETH",
        outputs: [
          { internalType: "uint256", name: "amountToken", type: "uint256" },
          { internalType: "uint256", name: "amountETH", type: "uint256" },
        ],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          { internalType: "address", name: "token", type: "address" },
          { internalType: "uint256", name: "liquidity", type: "uint256" },
          { internalType: "uint256", name: "amountTokenMin", type: "uint256" },
          { internalType: "uint256", name: "amountETHMin", type: "uint256" },
          { internalType: "address", name: "to", type: "address" },
          { internalType: "uint256", name: "deadline", type: "uint256" },
        ],
        name: "removeLiquidityETHSupportingFeeOnTransferTokens",
        outputs: [
          { internalType: "uint256", name: "amountETH", type: "uint256" },
        ],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          { internalType: "address", name: "token", type: "address" },
          { internalType: "uint256", name: "liquidity", type: "uint256" },
          { internalType: "uint256", name: "amountTokenMin", type: "uint256" },
          { internalType: "uint256", name: "amountETHMin", type: "uint256" },
          { internalType: "address", name: "to", type: "address" },
          { internalType: "uint256", name: "deadline", type: "uint256" },
          { internalType: "bool", name: "approveMax", type: "bool" },
          { internalType: "uint8", name: "v", type: "uint8" },
          { internalType: "bytes32", name: "r", type: "bytes32" },
          { internalType: "bytes32", name: "s", type: "bytes32" },
        ],
        name: "removeLiquidityETHWithPermit",
        outputs: [
          { internalType: "uint256", name: "amountToken", type: "uint256" },
          { internalType: "uint256", name: "amountETH", type: "uint256" },
        ],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          { internalType: "address", name: "token", type: "address" },
          { internalType: "uint256", name: "liquidity", type: "uint256" },
          { internalType: "uint256", name: "amountTokenMin", type: "uint256" },
          { internalType: "uint256", name: "amountETHMin", type: "uint256" },
          { internalType: "address", name: "to", type: "address" },
          { internalType: "uint256", name: "deadline", type: "uint256" },
          { internalType: "bool", name: "approveMax", type: "bool" },
          { internalType: "uint8", name: "v", type: "uint8" },
          { internalType: "bytes32", name: "r", type: "bytes32" },
          { internalType: "bytes32", name: "s", type: "bytes32" },
        ],
        name: "removeLiquidityETHWithPermitSupportingFeeOnTransferTokens",
        outputs: [
          { internalType: "uint256", name: "amountETH", type: "uint256" },
        ],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          { internalType: "address", name: "tokenA", type: "address" },
          { internalType: "address", name: "tokenB", type: "address" },
          { internalType: "uint256", name: "liquidity", type: "uint256" },
          { internalType: "uint256", name: "amountAMin", type: "uint256" },
          { internalType: "uint256", name: "amountBMin", type: "uint256" },
          { internalType: "address", name: "to", type: "address" },
          { internalType: "uint256", name: "deadline", type: "uint256" },
          { internalType: "bool", name: "approveMax", type: "bool" },
          { internalType: "uint8", name: "v", type: "uint8" },
          { internalType: "bytes32", name: "r", type: "bytes32" },
          { internalType: "bytes32", name: "s", type: "bytes32" },
        ],
        name: "removeLiquidityWithPermit",
        outputs: [
          { internalType: "uint256", name: "amountA", type: "uint256" },
          { internalType: "uint256", name: "amountB", type: "uint256" },
        ],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          { internalType: "uint256", name: "amountOut", type: "uint256" },
          { internalType: "address[]", name: "path", type: "address[]" },
          { internalType: "address", name: "to", type: "address" },
          { internalType: "uint256", name: "deadline", type: "uint256" },
        ],
        name: "swapETHForExactTokens",
        outputs: [
          { internalType: "uint256[]", name: "amounts", type: "uint256[]" },
        ],
        stateMutability: "payable",
        type: "function",
      },
      {
        inputs: [
          { internalType: "uint256", name: "amountOutMin", type: "uint256" },
          { internalType: "address[]", name: "path", type: "address[]" },
          { internalType: "address", name: "to", type: "address" },
          { internalType: "uint256", name: "deadline", type: "uint256" },
        ],
        name: "swapExactETHForTokens",
        outputs: [
          { internalType: "uint256[]", name: "amounts", type: "uint256[]" },
        ],
        stateMutability: "payable",
        type: "function",
      },
      {
        inputs: [
          { internalType: "uint256", name: "amountOutMin", type: "uint256" },
          { internalType: "address[]", name: "path", type: "address[]" },
          { internalType: "address", name: "to", type: "address" },
          { internalType: "uint256", name: "deadline", type: "uint256" },
        ],
        name: "swapExactETHForTokensSupportingFeeOnTransferTokens",
        outputs: [],
        stateMutability: "payable",
        type: "function",
      },
      {
        inputs: [
          { internalType: "uint256", name: "amountIn", type: "uint256" },
          { internalType: "uint256", name: "amountOutMin", type: "uint256" },
          { internalType: "address[]", name: "path", type: "address[]" },
          { internalType: "address", name: "to", type: "address" },
          { internalType: "uint256", name: "deadline", type: "uint256" },
        ],
        name: "swapExactTokensForETH",
        outputs: [
          { internalType: "uint256[]", name: "amounts", type: "uint256[]" },
        ],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          { internalType: "uint256", name: "amountIn", type: "uint256" },
          { internalType: "uint256", name: "amountOutMin", type: "uint256" },
          { internalType: "address[]", name: "path", type: "address[]" },
          { internalType: "address", name: "to", type: "address" },
          { internalType: "uint256", name: "deadline", type: "uint256" },
        ],
        name: "swapExactTokensForETHSupportingFeeOnTransferTokens",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          { internalType: "uint256", name: "amountIn", type: "uint256" },
          { internalType: "uint256", name: "amountOutMin", type: "uint256" },
          { internalType: "address[]", name: "path", type: "address[]" },
          { internalType: "address", name: "to", type: "address" },
          { internalType: "uint256", name: "deadline", type: "uint256" },
        ],
        name: "swapExactTokensForTokens",
        outputs: [
          { internalType: "uint256[]", name: "amounts", type: "uint256[]" },
        ],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          { internalType: "uint256", name: "amountIn", type: "uint256" },
          { internalType: "uint256", name: "amountOutMin", type: "uint256" },
          { internalType: "address[]", name: "path", type: "address[]" },
          { internalType: "address", name: "to", type: "address" },
          { internalType: "uint256", name: "deadline", type: "uint256" },
        ],
        name: "swapExactTokensForTokensSupportingFeeOnTransferTokens",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          { internalType: "uint256", name: "amountOut", type: "uint256" },
          { internalType: "uint256", name: "amountInMax", type: "uint256" },
          { internalType: "address[]", name: "path", type: "address[]" },
          { internalType: "address", name: "to", type: "address" },
          { internalType: "uint256", name: "deadline", type: "uint256" },
        ],
        name: "swapTokensForExactETH",
        outputs: [
          { internalType: "uint256[]", name: "amounts", type: "uint256[]" },
        ],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          { internalType: "uint256", name: "amountOut", type: "uint256" },
          { internalType: "uint256", name: "amountInMax", type: "uint256" },
          { internalType: "address[]", name: "path", type: "address[]" },
          { internalType: "address", name: "to", type: "address" },
          { internalType: "uint256", name: "deadline", type: "uint256" },
        ],
        name: "swapTokensForExactTokens",
        outputs: [
          { internalType: "uint256[]", name: "amounts", type: "uint256[]" },
        ],
        stateMutability: "nonpayable",
        type: "function",
      },
      { stateMutability: "payable", type: "receive" },
    ],
    "0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff"
  );
  const NASMG = await Fetcher.fetchTokenData(137, NASMGAddress);
  const WMATIC = await Fetcher.fetchTokenData(137, WMATICAddress);
  const pair = await Fetcher.fetchPairData(NASMG, WMATIC);
  const route = new Route([pair], token0.ticker == "NASMG" ? NASMG : WMATIC);
  const amountIn = web3Provider.utils.toWei(token0.amount, "ether");
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
  if (token0.ticker === "WMATIC") {
    await routerContract.methods
      .swapExactETHForTokens(amountOutMin, path, to, deadline)
      .send({ from: address, value: value, gasPrice: 21000 });
  }
  if (token0.ticker === "NASMG") {
    console.log("you are about to swap nasmg");
    console.log(token0.amount);
  }
}

export { getPrice, swap };
