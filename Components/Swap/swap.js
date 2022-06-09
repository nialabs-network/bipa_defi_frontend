// import "../../contracts/ERC20ABI";
// import { ERC20ABI } from "../../contracts/ERC20ABI";
// import { swapRouterAddress } from "./helper";
// import {
//   getPoolImmutables,
//   getPoolState,
//   getPoolContract,
//   getSwapRouterContract,
// } from "./helper";
// // 0xA6FA4fB5f76172d178d61B04b0ecd319C5d1C0aa WETH
// // 0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889 WMATIC
// async function swap(token0, expAmount, address, web3Provider) {
//   const poolContract = await getPoolContract(web3Provider);
//   const immutables = await getPoolImmutables(poolContract);
//   const state = await getPoolState(poolContract);
//   const swapRouterContract = await getSwapRouterContract(web3Provider);
//   const amountIn = web3Provider.utils.toWei(token0.amount, "ether");
//   console.log(
//     `swapping ${token0.amount} of ${token0.ticker}(${
//       immutables[`token${token0.token}`]
//     }) tokenId: ${token0.token}`
//   );

//   const tokenContract = new web3Provider.eth.Contract(
//     ERC20ABI,
//     immutables[`token${token0.token == 0 ? 0 : 1}`]
//   );

//   // MATIC->WMATIC
//   if (token0.token === 0) {
//     const wmatic = await tokenContract.methods
//       .deposit()
//       .send({ from: address, value: amountIn });
//     console.log(wmatic);
//   }

//   //allowance and approval step
//   const isApproved = await tokenContract.methods
//     .allowance(address, swapRouterAddress)
//     .call();
//   console.log(isApproved);
//   console.log(amountIn);
//   console.log(parseInt(isApproved) < parseInt(amountIn));
//   if (parseInt(isApproved) < parseInt(amountIn)) {
//     console.log(
//       await tokenContract.methods
//         .approve(swapRouterAddress, "10000000000000000000000000000000")
//         .send({ from: address })
//     );
//   }
//   //params for swap
//   const params = {
//     tokenIn: immutables[`token${token0.token}`],
//     tokenOut: immutables[`token${token0.token === 0 ? 1 : 0}`],
//     fee: immutables.fee,
//     recipient: address,
//     deadline: Math.floor(Date.now() / 1000) + 10 * 60,
//     amountIn: amountIn,
//     amountOutMinimum: 0,
//     sqrtPriceLimitX96: 0,
//   };
//   console.log(params);
//   //running a swap
//   const transaction = await swapRouterContract.methods
//     .exactInputSingle(params)
//     .send({
//       from: address,
//     });
//   console.log(transaction);
//   console.log(transaction.events[0].raw.data, "blockchain data");
//   console.log(
//     parseInt(transaction.events[0].raw.data, 16).toString(),
//     "js parsed string"
//   );
//   console.log(parseInt(transaction.events[0].raw.data, 16), "js parsed number");
//   console.log(
//     web3Provider.utils.toBN(transaction.events[0].raw.data.toString()),
//     "web3js utils (string)"
//   );
//   console.log(
//     web3Provider.utils.toBN(transaction.events[0].raw.data),
//     "web3js utils (from bc)"
//   );
//   console.log(
//     web3Provider.utils.toBN(transaction.events[0].raw.data).toString(),
//     "web3js utils (from bc)"
//   );
//   console.log(web3Provider.utils.toWei(expAmount, "ether"), "price quote");
//   const tokenContract0 = new web3Provider.eth.Contract(
//     ERC20ABI,
//     immutables.token0
//   );
//   //WMATIC to MATIC
//   if (token0.token === 1) {
//     const matic = await tokenContract0.methods
//       .withdraw(
//         web3Provider.utils.toBN(transaction.events[0].raw.data).toString()
//       )
//       .send({ from: address });
//     console.log(matic);
//   }
//   return 1;
// }
// export { swap };
