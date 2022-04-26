import "../../contracts/ERC20ABI";
import { ERC20ABI } from "../../contracts/ERC20ABI";

import {
  getPoolImmutables,
  getPoolState,
  getPoolContract,
  getSwapRouterContract,
} from "./helper";
// 0xA6FA4fB5f76172d178d61B04b0ecd319C5d1C0aa WETH
// 0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889 WMATIC
async function swap(inputAmount, address, web3Provider) {
  const poolContract = await getPoolContract(web3Provider);

  const immutables = await getPoolImmutables(poolContract);
  const state = await getPoolState(poolContract);
  const swapRouterContract = await getSwapRouterContract(web3Provider);
  console.log(swapRouterContract);
  const amountIn = web3Provider.utils.toWei(inputAmount, "ether");
  console.log(
    "Gonna swap",
    inputAmount,
    " WMATIC (",
    immutables.token0,
    ")to  WETH (",
    immutables.token1,
    " )"
  );
  //approval step
  const approvalAmount = (amountIn * 1.5).toString();
  const tokenContract1 = new web3Provider.eth.Contract(
    ERC20ABI,
    immutables.token1
  );
  const approvalResponse = await tokenContract1.methods
    .approve("0xe592427a0aece92de3edee1f18e0157c05861564", approvalAmount)
    .send({
      from: address,
      gasPrice: await web3Provider.eth.getGasPrice(),
      gasLimit: 5000000,
    });
  console.log(approvalResponse);
  ///////////////////////////////////////
  const params = {
    tokenIn: immutables.token1,
    tokenOut: immutables.token0,
    fee: immutables.fee,
    recipient: address,
    deadline: Math.floor(Date.now() / 1000) + 10 * 60,
    amountIn: amountIn,
    amountOutMinimum: amountIn,
    sqrtPriceLimitX96: 0,
  };
  const transaction = await swapRouterContract.methods
    .exactInputSingle(params)
    .send({
      from: address,
      gasPrice: await web3Provider.eth.getGasPrice(),
      gasLimit: 5000000,
    });
  console.log(transaction);
}
export { swap };
