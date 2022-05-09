const Token = artifacts.require("Token");
const Staking = artifacts.require("Staking");

module.exports = async function (deployer) {
  await deployer.deploy(Token);
  const token = await Token.deployed();
  await deployer.deploy(Staking, token.address);
  const staking = await Staking.deployed();
  await token.passMinterRole(staking.address);
};
