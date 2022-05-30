import IUniswapV3PoolABI from "@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json";
import SwapRouterABI from "@uniswap/v3-periphery/artifacts/contracts/SwapRouter.sol/SwapRouter.json";
const poolAddress = "0xa52daF14F3948752b8cA863051E1a7C76C935051"; // wmatic/nasmg
//0xc1FF5D622aEBABd51409e01dF4461936b0Eb4E43 0.03% fee pool
//0x99D59d73bAd8BE070FeA364717400043490866c9 0.1% fee pool
//0xa52daF14F3948752b8cA863051E1a7C76C935051 wmatic/nasmg
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
  swapRouterAddress,
  quoterAddress,
  getPoolImmutables,
  getPoolContract,
  getPoolState,
  getSwapRouterContract,
};
