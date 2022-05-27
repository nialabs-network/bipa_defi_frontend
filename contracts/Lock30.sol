// SPDX-License-Identifier: MIT

pragma solidity >=0.7.0 <0.9.0;

//interface for ierc20token
interface IERC20Token {
    function transfer(address to, uint256 amount) external returns (bool);

    function balanceOf(address account) external view returns (uint256);

    function transferFrom(
        address from,
        address to,
        uint256 amount
    ) external returns (bool);
}

contract Lock30 {
    //structure for storing all the data related to all the locks
    struct StakingInfo {
        address owner;
        uint256 lockedAmount;
        uint256 lockTime;
        uint256 lastClaim;
        uint256 nasmgPaidOutRewards;
        uint256 diboPaidOutRewards;
    }

    IERC20Token private nasmgToken;
    IERC20Token private diboToken;
    uint256 private diboInterestPerSecond = 951293759; //(3%) formula: 10^18 * (interest/100) / 365 / 24 / 60 / 60
    uint256 private nasmgInterestPerSecond = 951293759; //(3%) formula: 10^18 * (interest/100) / 365 / 24 / 60 / 60
    address public owner;
    address[] private stakers;
    uint256 public lockPeriod = 300; //in seconds
    uint256 public totalValueLocked;

    mapping(address => StakingInfo) public lockOf;

    event Deposit(address indexed user, uint256 amount, uint256 timestamp);
    event Withdraw(address indexed user, uint256 amount, uint256 timestamp);

    constructor(address nasmg, address dibo) {
        nasmgToken = IERC20Token(nasmg);
        diboToken = IERC20Token(dibo);
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
        require(_amount > 0, "You cannot stake nothing"); //empty lock is not available
        lockOf[msg.sender] = StakingInfo(
            msg.sender,
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
