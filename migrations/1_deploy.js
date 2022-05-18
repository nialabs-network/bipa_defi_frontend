const NASMGToken = artifacts.require("NASMG");
const Staking = artifacts.require("Staking");

module.exports = async function (deployer, network, accounts) {
  await deployer.deploy(NASMGToken);
  const token = await NASMGToken.deployed();
  await token.approve(accounts[0], "1000000000000000000000000000000");
  await token.transferFrom(
    accounts[0],
    accounts[1],
    "1000000000000000000000000000"
  );
  await deployer.deploy(Staking, token.address);
  const staking = await Staking.deployed();
  await token.approve(staking.address, "1000000000000000000000000000000");
};
