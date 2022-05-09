// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Token is ERC20 {
 
address public minter; //owner

  event MinterChanged(address indexed from, address to);

  constructor() payable ERC20("NASMG Token", "NASMG") {
    minter = msg.sender;
  }

  function passMinterRole(address staking) public returns(bool)
  {
    require(msg.sender == minter, 'only minter can do that');
    minter = staking;
    emit MinterChanged(msg.sender, staking);
    return true;
  }

  function mint(address account, uint256 amount) public {
    //check if msg.sender have minter role
    require(msg.sender == minter, 'only minter can mint');
		_mint(account, amount);
	}
}