import IUniswapV3PoolABI from "@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json";
import SwapRouterABI from "@uniswap/v3-periphery/artifacts/contracts/interfaces/ISwapRouter.sol/ISwapRouter.json";
const poolAddress = "0x99D59d73bAd8BE070FeA364717400043490866c9"; //WMATIC/WETH
const quoterAddress = "0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6";
const swapRouterAddress = "0xE592427A0AEce92De3Edee1F18E0157C05861564";

async function getPoolContract(web3Provider) {
  return new web3Provider.eth.Contract(IUniswapV3PoolABI.abi, poolAddress);
}

async function getPoolImmutables(poolContract) {
  const [token0, token1, fee] = await Promise.all([
    poolContract.methods.token0().call(),
    poolContract.methods.token1().call(),
    poolContract.methods.fee().call(),
  ]);
  const immutables = { token0, token1, fee };

  console.log(immutables);
  return immutables;
}

async function getPoolState(poolContract) {
  const slot = await poolContract.methods.slot0().call();
  const state = {
    sqrtPriceX96: slot[0],
  };
  return state;
}
async function getSwapRouterContract(web3Provider) {
  return new web3Provider.eth.Contract(SwapRouterABI.abi, swapRouterAddress);
}
export {
  quoterAddress,
  getPoolImmutables,
  getPoolContract,
  getPoolState,
  getSwapRouterContract,
};

/******************************************************************************* */
// const tokenAbi0 = [
//   {
//     constant: true,
//     inputs: [],
//     name: "name",
//     outputs: [{ name: "", type: "string" }],
//     payable: false,
//     stateMutability: "view",
//     type: "function",
//   },
//   {
//     constant: false,
//     inputs: [
//       { name: "guy", type: "address" },
//       { name: "wad", type: "uint256" },
//     ],
//     name: "approve",
//     outputs: [{ name: "", type: "bool" }],
//     payable: false,
//     stateMutability: "nonpayable",
//     type: "function",
//   },
//   {
//     constant: true,
//     inputs: [],
//     name: "totalSupply",
//     outputs: [{ name: "", type: "uint256" }],
//     payable: false,
//     stateMutability: "view",
//     type: "function",
//   },
//   {
//     constant: false,
//     inputs: [
//       { name: "src", type: "address" },
//       { name: "dst", type: "address" },
//       { name: "wad", type: "uint256" },
//     ],
//     name: "transferFrom",
//     outputs: [{ name: "", type: "bool" }],
//     payable: false,
//     stateMutability: "nonpayable",
//     type: "function",
//   },
//   {
//     constant: false,
//     inputs: [{ name: "wad", type: "uint256" }],
//     name: "withdraw",
//     outputs: [],
//     payable: false,
//     stateMutability: "nonpayable",
//     type: "function",
//   },
//   {
//     constant: true,
//     inputs: [],
//     name: "decimals",
//     outputs: [{ name: "", type: "uint8" }],
//     payable: false,
//     stateMutability: "view",
//     type: "function",
//   },
//   {
//     constant: true,
//     inputs: [{ name: "", type: "address" }],
//     name: "balanceOf",
//     outputs: [{ name: "", type: "uint256" }],
//     payable: false,
//     stateMutability: "view",
//     type: "function",
//   },
//   {
//     constant: true,
//     inputs: [],
//     name: "symbol",
//     outputs: [{ name: "", type: "string" }],
//     payable: false,
//     stateMutability: "view",
//     type: "function",
//   },
//   {
//     constant: false,
//     inputs: [
//       { name: "dst", type: "address" },
//       { name: "wad", type: "uint256" },
//     ],
//     name: "transfer",
//     outputs: [{ name: "", type: "bool" }],
//     payable: false,
//     stateMutability: "nonpayable",
//     type: "function",
//   },
//   {
//     constant: false,
//     inputs: [],
//     name: "deposit",
//     outputs: [],
//     payable: true,
//     stateMutability: "payable",
//     type: "function",
//   },
//   {
//     constant: true,
//     inputs: [
//       { name: "", type: "address" },
//       { name: "", type: "address" },
//     ],
//     name: "allowance",
//     outputs: [{ name: "", type: "uint256" }],
//     payable: false,
//     stateMutability: "view",
//     type: "function",
//   },
//   { payable: true, stateMutability: "payable", type: "fallback" },
//   {
//     anonymous: false,
//     inputs: [
//       { indexed: true, name: "src", type: "address" },
//       { indexed: true, name: "guy", type: "address" },
//       { indexed: false, name: "wad", type: "uint256" },
//     ],
//     name: "Approval",
//     type: "event",
//   },
//   {
//     anonymous: false,
//     inputs: [
//       { indexed: true, name: "src", type: "address" },
//       { indexed: true, name: "dst", type: "address" },
//       { indexed: false, name: "wad", type: "uint256" },
//     ],
//     name: "Transfer",
//     type: "event",
//   },
//   {
//     anonymous: false,
//     inputs: [
//       { indexed: true, name: "dst", type: "address" },
//       { indexed: false, name: "wad", type: "uint256" },
//     ],
//     name: "Deposit",
//     type: "event",
//   },
//   {
//     anonymous: false,
//     inputs: [
//       { indexed: true, name: "src", type: "address" },
//       { indexed: false, name: "wad", type: "uint256" },
//     ],
//     name: "Withdrawal",
//     type: "event",
//   },
// ];
// const tokenAbi1 = [
//   {
//     constant: true,
//     inputs: [],
//     name: "name",
//     outputs: [{ name: "", type: "string" }],
//     payable: false,
//     stateMutability: "view",
//     type: "function",
//   },
//   {
//     constant: false,
//     inputs: [
//       { name: "guy", type: "address" },
//       { name: "wad", type: "uint256" },
//     ],
//     name: "approve",
//     outputs: [{ name: "", type: "bool" }],
//     payable: false,
//     stateMutability: "nonpayable",
//     type: "function",
//   },
//   {
//     constant: true,
//     inputs: [],
//     name: "totalSupply",
//     outputs: [{ name: "", type: "uint256" }],
//     payable: false,
//     stateMutability: "view",
//     type: "function",
//   },
//   {
//     constant: false,
//     inputs: [
//       { name: "src", type: "address" },
//       { name: "dst", type: "address" },
//       { name: "wad", type: "uint256" },
//     ],
//     name: "transferFrom",
//     outputs: [{ name: "", type: "bool" }],
//     payable: false,
//     stateMutability: "nonpayable",
//     type: "function",
//   },
//   {
//     constant: false,
//     inputs: [{ name: "wad", type: "uint256" }],
//     name: "withdraw",
//     outputs: [],
//     payable: false,
//     stateMutability: "nonpayable",
//     type: "function",
//   },
//   {
//     constant: true,
//     inputs: [],
//     name: "decimals",
//     outputs: [{ name: "", type: "uint8" }],
//     payable: false,
//     stateMutability: "view",
//     type: "function",
//   },
//   {
//     constant: true,
//     inputs: [{ name: "", type: "address" }],
//     name: "balanceOf",
//     outputs: [{ name: "", type: "uint256" }],
//     payable: false,
//     stateMutability: "view",
//     type: "function",
//   },
//   {
//     constant: true,
//     inputs: [],
//     name: "symbol",
//     outputs: [{ name: "", type: "string" }],
//     payable: false,
//     stateMutability: "view",
//     type: "function",
//   },
//   {
//     constant: false,
//     inputs: [
//       { name: "dst", type: "address" },
//       { name: "wad", type: "uint256" },
//     ],
//     name: "transfer",
//     outputs: [{ name: "", type: "bool" }],
//     payable: false,
//     stateMutability: "nonpayable",
//     type: "function",
//   },
//   {
//     constant: false,
//     inputs: [],
//     name: "deposit",
//     outputs: [],
//     payable: true,
//     stateMutability: "payable",
//     type: "function",
//   },
//   {
//     constant: true,
//     inputs: [
//       { name: "", type: "address" },
//       { name: "", type: "address" },
//     ],
//     name: "allowance",
//     outputs: [{ name: "", type: "uint256" }],
//     payable: false,
//     stateMutability: "view",
//     type: "function",
//   },
//   { payable: true, stateMutability: "payable", type: "fallback" },
//   {
//     anonymous: false,
//     inputs: [
//       { indexed: true, name: "src", type: "address" },
//       { indexed: true, name: "guy", type: "address" },
//       { indexed: false, name: "wad", type: "uint256" },
//     ],
//     name: "Approval",
//     type: "event",
//   },
//   {
//     anonymous: false,
//     inputs: [
//       { indexed: true, name: "src", type: "address" },
//       { indexed: true, name: "dst", type: "address" },
//       { indexed: false, name: "wad", type: "uint256" },
//     ],
//     name: "Transfer",
//     type: "event",
//   },
//   {
//     anonymous: false,
//     inputs: [
//       { indexed: true, name: "dst", type: "address" },
//       { indexed: false, name: "wad", type: "uint256" },
//     ],
//     name: "Deposit",
//     type: "event",
//   },
//   {
//     anonymous: false,
//     inputs: [
//       { indexed: true, name: "src", type: "address" },
//       { indexed: false, name: "wad", type: "uint256" },
//     ],
//     name: "Withdrawal",
//     type: "event",
//   },
// ];
/******************************************************************************* */
// const tokenContract0 = new web3Provider.eth.Contract(
//   tokenAbi0,
//   tokenAddress0
// );
// const tokenContract1 = new web3Provider.eth.Contract(
//   tokenAbi1,
//   tokenAddress1
// );
/******************************************************************************* */
// const tokenSymbol0 = await tokenContract0.methods.symbol().call();
// const tokenSymbol1 = await tokenContract1.methods.symbol().call();
// const tokenDecimals0 = await tokenContract0.methods.decimals().call();
// const tokenDecomals1 = await tokenContract1.methods.decimals().call();
/******************************************************************************* */

//get pool address
// const factory = new web3Provider.eth.Contract(
//   [
//     { inputs: [], stateMutability: "nonpayable", type: "constructor" },
//     {
//       anonymous: false,
//       inputs: [
//         {
//           indexed: true,
//           internalType: "uint24",
//           name: "fee",
//           type: "uint24",
//         },
//         {
//           indexed: true,
//           internalType: "int24",
//           name: "tickSpacing",
//           type: "int24",
//         },
//       ],
//       name: "FeeAmountEnabled",
//       type: "event",
//     },
//     {
//       anonymous: false,
//       inputs: [
//         {
//           indexed: true,
//           internalType: "address",
//           name: "oldOwner",
//           type: "address",
//         },
//         {
//           indexed: true,
//           internalType: "address",
//           name: "newOwner",
//           type: "address",
//         },
//       ],
//       name: "OwnerChanged",
//       type: "event",
//     },
//     {
//       anonymous: false,
//       inputs: [
//         {
//           indexed: true,
//           internalType: "address",
//           name: "token0",
//           type: "address",
//         },
//         {
//           indexed: true,
//           internalType: "address",
//           name: "token1",
//           type: "address",
//         },
//         {
//           indexed: true,
//           internalType: "uint24",
//           name: "fee",
//           type: "uint24",
//         },
//         {
//           indexed: false,
//           internalType: "int24",
//           name: "tickSpacing",
//           type: "int24",
//         },
//         {
//           indexed: false,
//           internalType: "address",
//           name: "pool",
//           type: "address",
//         },
//       ],
//       name: "PoolCreated",
//       type: "event",
//     },
//     {
//       inputs: [
//         { internalType: "address", name: "tokenA", type: "address" },
//         { internalType: "address", name: "tokenB", type: "address" },
//         { internalType: "uint24", name: "fee", type: "uint24" },
//       ],
//       name: "createPool",
//       outputs: [{ internalType: "address", name: "pool", type: "address" }],
//       stateMutability: "nonpayable",
//       type: "function",
//     },
//     {
//       inputs: [
//         { internalType: "uint24", name: "fee", type: "uint24" },
//         { internalType: "int24", name: "tickSpacing", type: "int24" },
//       ],
//       name: "enableFeeAmount",
//       outputs: [],
//       stateMutability: "nonpayable",
//       type: "function",
//     },
//     {
//       inputs: [{ internalType: "uint24", name: "", type: "uint24" }],
//       name: "feeAmountTickSpacing",
//       outputs: [{ internalType: "int24", name: "", type: "int24" }],
//       stateMutability: "view",
//       type: "function",
//     },
//     {
//       inputs: [
//         { internalType: "address", name: "", type: "address" },
//         { internalType: "address", name: "", type: "address" },
//         { internalType: "uint24", name: "", type: "uint24" },
//       ],
//       name: "getPool",
//       outputs: [{ internalType: "address", name: "", type: "address" }],
//       stateMutability: "view",
//       type: "function",
//     },
//     {
//       inputs: [],
//       name: "owner",
//       outputs: [{ internalType: "address", name: "", type: "address" }],
//       stateMutability: "view",
//       type: "function",
//     },
//     {
//       inputs: [],
//       name: "parameters",
//       outputs: [
//         { internalType: "address", name: "factory", type: "address" },
//         { internalType: "address", name: "token0", type: "address" },
//         { internalType: "address", name: "token1", type: "address" },
//         { internalType: "uint24", name: "fee", type: "uint24" },
//         { internalType: "int24", name: "tickSpacing", type: "int24" },
//       ],
//       stateMutability: "view",
//       type: "function",
//     },
//     {
//       inputs: [{ internalType: "address", name: "_owner", type: "address" }],
//       name: "setOwner",
//       outputs: [],
//       stateMutability: "nonpayable",
//       type: "function",
//     },
//   ],
//   "0x1F98431c8aD98523631AE4a59f267346ea31F984"
// );
// const pool = await factory.methods
//   .getPool(
//     "0xE03489D4E90b22c59c5e23d45DFd59Fc0dB8a025",
//     "0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889",
//     3000
//   )
//   .call();
// console.log(pool);
