// SPDX-License-Identifier: MIT

pragma solidity >=0.7.0 <0.9.0;

contract NASMGToken {
    function transferFrom(
        address from,
        address to,
        uint256 amount
    ) public {}

    function transfer(address to, uint256 amount) public {}
}

contract DIBOToken {
    function transferFrom(
        address from,
        address to,
        uint256 amount
    ) public {}

    function transfer(address addr, uint256 amount) public {}
}

contract Lock {
    struct User {
        uint256 lockedAmount;
        uint256 lockTime;
        uint256 lastClaim;
        uint256 nasmgPaidOutRewards;
        uint256 diboPaidOutRewards;
    }

    NASMGToken private nasmgToken;
    DIBOToken private diboToken;
    uint256 private diboInterestPerSecond = 100000000; //(3%) formula: 10^18 * (interest/100) / 365 / 24 / 60 / 60
    uint256 private nasmgInterestPerSecond = 100000000; //(3%) formula: 10^18 * (interest/100) / 365 / 24 / 60 / 60
    address private owner;
    uint256 public lockPeriod = 300; //30 days
    uint256 public totalValueLocked;

    mapping(address => User) public lockOf;

    constructor() {
        nasmgToken = NASMGToken(0x310Cf9575ea20443e6E82B67d2545FA87557258B);
        diboToken = DIBOToken(0xb69f5734dF86eA2Ee7531A949d01a11cc2404CfA);
        owner = msg.sender;
    }

    // function changeInterest(uint _interestPerSecond) public {
    //     require(msg.sender == owner, "you are not the owner");
    // }

    function lock(uint256 _amount) public {
        require(
            lockOf[msg.sender].lockedAmount == 0,
            "You have already staked"
        ); //additional lock is not available
        require(_amount > 0, "You cannot stake 0"); //empty lock is not available
        lockOf[msg.sender] = User(
            _amount,
            block.timestamp,
            block.timestamp,
            lockOf[msg.sender].nasmgPaidOutRewards,
            lockOf[msg.sender].diboPaidOutRewards
        ); //create user instance and set all the data needed
        nasmgToken.transferFrom(msg.sender, address(this), _amount); //send tokens from user to the contract
        totalValueLocked = totalValueLocked + _amount; //total value locked
    }

    function withdraw() public {
        require(
            lockOf[msg.sender].lockedAmount > 0,
            "You are not staking anything"
        );
        require(
            block.timestamp >= lockOf[msg.sender].lockTime + lockPeriod,
            "Assets are still locked"
        );
        uint256 reward = nasmgInterestPerSecond *
            lockPeriod *
            (lockOf[msg.sender].lockedAmount / 1e18);
        nasmgToken.transferFrom(owner, msg.sender, reward);
        lockOf[msg.sender].nasmgPaidOutRewards =
            lockOf[msg.sender].nasmgPaidOutRewards +
            reward;

        // //calculating outstanding dibo
        uint256 diboPeriod = lockOf[msg.sender].lockTime +
            lockPeriod -
            lockOf[msg.sender].lastClaim;
        uint256 diboReward = diboInterestPerSecond *
            diboPeriod *
            (lockOf[msg.sender].lockedAmount / 1e18);

        if (diboReward > 0) {
            diboToken.transferFrom(owner, msg.sender, diboReward);
            lockOf[msg.sender].diboPaidOutRewards =
                lockOf[msg.sender].diboPaidOutRewards +
                diboReward;
            lockOf[msg.sender].lastClaim = block.timestamp;
        }
        nasmgToken.transfer(msg.sender, lockOf[msg.sender].lockedAmount);
        totalValueLocked = totalValueLocked - lockOf[msg.sender].lockedAmount;
        lockOf[msg.sender].lockedAmount = 0;
    }

    function claimDiboRewards() public {
        require(claimableRewards() > 0, "Nothing to claim");
        require(
            lockOf[msg.sender].lockedAmount > 0,
            "You are not staking anything"
        );
        uint256 period;
        if (block.timestamp >= lockOf[msg.sender].lockTime + lockPeriod) {
            //if period is over
            period =
                (lockOf[msg.sender].lockTime + lockPeriod) -
                lockOf[msg.sender].lastClaim;
            lockOf[msg.sender].lastClaim =
                lockOf[msg.sender].lockTime +
                lockPeriod;
        } else {
            period = block.timestamp - lockOf[msg.sender].lastClaim;
            lockOf[msg.sender].lastClaim = block.timestamp;
        }
        uint256 reward = period *
            diboInterestPerSecond *
            (lockOf[msg.sender].lockedAmount / 1e18);
        diboToken.transferFrom(owner, msg.sender, reward);
        lockOf[msg.sender].diboPaidOutRewards =
            lockOf[msg.sender].diboPaidOutRewards +
            reward;
    }

    function claimableRewards() public view returns (uint256) {
        require(lockOf[msg.sender].lockedAmount > 0);
        uint256 period;
        if (block.timestamp >= lockOf[msg.sender].lockTime + lockPeriod) {
            //if period is over
            period =
                (lockOf[msg.sender].lockTime + lockPeriod) -
                lockOf[msg.sender].lastClaim;
        } else {
            period = block.timestamp - lockOf[msg.sender].lastClaim;
        }
        uint256 claimableReward;
        if (lockOf[msg.sender].lockedAmount > 0) {
            claimableReward =
                period *
                diboInterestPerSecond *
                (lockOf[msg.sender].lockedAmount / 1e18);
        } else {
            claimableReward = 0;
        }
        return claimableReward;
    }

    function blocktime() public view returns (uint256) {
        return block.timestamp;
    }
}
