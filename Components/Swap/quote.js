import IUniswapV3PoolABI from "@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json";
import QuoterABI from "@uniswap/v3-periphery/artifacts/contracts/lens/Quoter.sol/Quoter.json";

/******************************************************************************* */
const poolAddress = "0xa9077cDB3D13F45B8B9d87C43E11bCe0e73d8631"; //MATIC/AAVE
const quoterAddress = "0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6";

async function getPrice(inputAmount, web3Provider) {
  const poolContract = new web3Provider.eth.Contract(
    IUniswapV3PoolABI.abi,
    poolAddress
  );
  console.log(poolContract, "pool contract");
  /******************************************************************************* */
  const tokenAddress0 = await poolContract.methods.token0().call();
  const tokenAddress1 = await poolContract.methods.token1().call();
  console.log(tokenAddress1, "token address 1");
  /******************************************************************************* */
  const tokenAbi0 = [
    {
      constant: true,
      inputs: [],
      name: "name",
      outputs: [{ name: "", type: "string" }],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: false,
      inputs: [
        { name: "guy", type: "address" },
        { name: "wad", type: "uint256" },
      ],
      name: "approve",
      outputs: [{ name: "", type: "bool" }],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: true,
      inputs: [],
      name: "totalSupply",
      outputs: [{ name: "", type: "uint256" }],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: false,
      inputs: [
        { name: "src", type: "address" },
        { name: "dst", type: "address" },
        { name: "wad", type: "uint256" },
      ],
      name: "transferFrom",
      outputs: [{ name: "", type: "bool" }],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: false,
      inputs: [{ name: "wad", type: "uint256" }],
      name: "withdraw",
      outputs: [],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: true,
      inputs: [],
      name: "decimals",
      outputs: [{ name: "", type: "uint8" }],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: true,
      inputs: [{ name: "", type: "address" }],
      name: "balanceOf",
      outputs: [{ name: "", type: "uint256" }],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: true,
      inputs: [],
      name: "symbol",
      outputs: [{ name: "", type: "string" }],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: false,
      inputs: [
        { name: "dst", type: "address" },
        { name: "wad", type: "uint256" },
      ],
      name: "transfer",
      outputs: [{ name: "", type: "bool" }],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: false,
      inputs: [],
      name: "deposit",
      outputs: [],
      payable: true,
      stateMutability: "payable",
      type: "function",
    },
    {
      constant: true,
      inputs: [
        { name: "", type: "address" },
        { name: "", type: "address" },
      ],
      name: "allowance",
      outputs: [{ name: "", type: "uint256" }],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    { payable: true, stateMutability: "payable", type: "fallback" },
    {
      anonymous: false,
      inputs: [
        { indexed: true, name: "src", type: "address" },
        { indexed: true, name: "guy", type: "address" },
        { indexed: false, name: "wad", type: "uint256" },
      ],
      name: "Approval",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        { indexed: true, name: "src", type: "address" },
        { indexed: true, name: "dst", type: "address" },
        { indexed: false, name: "wad", type: "uint256" },
      ],
      name: "Transfer",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        { indexed: true, name: "dst", type: "address" },
        { indexed: false, name: "wad", type: "uint256" },
      ],
      name: "Deposit",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        { indexed: true, name: "src", type: "address" },
        { indexed: false, name: "wad", type: "uint256" },
      ],
      name: "Withdrawal",
      type: "event",
    },
  ];
  const tokenAbi1 = [
    {
      constant: true,
      inputs: [],
      name: "name",
      outputs: [{ name: "", type: "string" }],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: false,
      inputs: [
        { name: "guy", type: "address" },
        { name: "wad", type: "uint256" },
      ],
      name: "approve",
      outputs: [{ name: "", type: "bool" }],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: true,
      inputs: [],
      name: "totalSupply",
      outputs: [{ name: "", type: "uint256" }],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: false,
      inputs: [
        { name: "src", type: "address" },
        { name: "dst", type: "address" },
        { name: "wad", type: "uint256" },
      ],
      name: "transferFrom",
      outputs: [{ name: "", type: "bool" }],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: false,
      inputs: [{ name: "wad", type: "uint256" }],
      name: "withdraw",
      outputs: [],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: true,
      inputs: [],
      name: "decimals",
      outputs: [{ name: "", type: "uint8" }],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: true,
      inputs: [{ name: "", type: "address" }],
      name: "balanceOf",
      outputs: [{ name: "", type: "uint256" }],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: true,
      inputs: [],
      name: "symbol",
      outputs: [{ name: "", type: "string" }],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: false,
      inputs: [
        { name: "dst", type: "address" },
        { name: "wad", type: "uint256" },
      ],
      name: "transfer",
      outputs: [{ name: "", type: "bool" }],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: false,
      inputs: [],
      name: "deposit",
      outputs: [],
      payable: true,
      stateMutability: "payable",
      type: "function",
    },
    {
      constant: true,
      inputs: [
        { name: "", type: "address" },
        { name: "", type: "address" },
      ],
      name: "allowance",
      outputs: [{ name: "", type: "uint256" }],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    { payable: true, stateMutability: "payable", type: "fallback" },
    {
      anonymous: false,
      inputs: [
        { indexed: true, name: "src", type: "address" },
        { indexed: true, name: "guy", type: "address" },
        { indexed: false, name: "wad", type: "uint256" },
      ],
      name: "Approval",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        { indexed: true, name: "src", type: "address" },
        { indexed: true, name: "dst", type: "address" },
        { indexed: false, name: "wad", type: "uint256" },
      ],
      name: "Transfer",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        { indexed: true, name: "dst", type: "address" },
        { indexed: false, name: "wad", type: "uint256" },
      ],
      name: "Deposit",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        { indexed: true, name: "src", type: "address" },
        { indexed: false, name: "wad", type: "uint256" },
      ],
      name: "Withdrawal",
      type: "event",
    },
  ];
  /******************************************************************************* */
  const tokenContract0 = new web3Provider.eth.Contract(
    tokenAbi0,
    tokenAddress0
  );
  const tokenContract1 = new web3Provider.eth.Contract(
    tokenAbi1,
    tokenAddress1
  );
  console.log(tokenContract0, "token contract0");
  console.log(tokenContract1, "token contract1");
  /******************************************************************************* */
  const tokenSymbol0 = await tokenContract0.methods.symbol().call();
  const tokenSymbol1 = await tokenContract1.methods.symbol().call();
  const tokenDecimals0 = await tokenContract0.methods.decimals().call();
  const tokenDecomals1 = await tokenContract1.methods.decimals().call();
  console.log("========================================================");
  console.log(tokenSymbol1, tokenDecomals1);
  console.log(tokenSymbol0, tokenDecimals0);
  /******************************************************************************* */
  const quoterContract = new web3Provider.eth.Contract(
    QuoterABI.abi,
    quoterAddress
  );
  async function getPoolImmutables() {
    const [token0, token1, fee] = await Promise.all([
      poolContract.token0(),
      poolContract.token1(),
      poolContract.fee(),
    ]);
    const immutables = { token0, token1, fee };
    return immutables;
  }
  /******************************************************************************* */
  console.error("test");
  console.log();
}

export { getPrice };
