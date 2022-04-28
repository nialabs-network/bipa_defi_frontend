import QuoterABI from "@uniswap/v3-periphery/artifacts/contracts/lens/Quoter.sol/Quoter.json";
import { quoterAddress, getPoolImmutables, getPoolContract } from "./helper";

async function getPrice(token, web3Provider) {
  //instantiating UNISWAP pool contract
  const poolContract = await getPoolContract(web3Provider);
  //retrieving UNISWAP pool immutables
  const immutables = await getPoolImmutables(poolContract);
  //instantiating UNISWAP quoter contract
  const quoterContract = new web3Provider.eth.Contract(
    QuoterABI.abi,
    quoterAddress
  );
  const amountIn = web3Provider.utils.toWei(token.amount, "ether");
  //retrieving quoted price
  const quotedAmountOut = await quoterContract.methods
    .quoteExactInputSingle(
      immutables[`token${token.token}`],
      immutables[`token${token.token === 0 ? 1 : 0}`],
      immutables.fee,
      amountIn,
      0
    )
    .call();
  console.log(quotedAmountOut);
  const amountOut = web3Provider.utils.fromWei(quotedAmountOut, "ether");
  return amountOut;
}

export { getPrice };
