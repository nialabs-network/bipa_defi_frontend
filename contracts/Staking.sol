// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

//final testing deploy 20220526

interface IERC20Token {
    function transfer(address to, uint256 amount) external returns (bool);

    function balanceOf(address account) external view returns (uint256);

    function transferFrom(
        address from,
        address to,
        uint256 amount
    ) external returns (bool);
}

contract Staking {
    IERC20Token private stakingToken;

    uint256 public interestPerSecond = 500000000000000000; //formula (10^18 * interestInPercents / 100) / 365 / 24 / 60 / 60
    address public owner;
    address[] private stakers;
    uint256 public totalValueLocked;

    struct StakingInfo {
        address owner;
        uint256 stakingBalance;
        uint256 holdStart;
        uint256 accruedRewards;
        uint256 paidOutRewards;
        bool hasStaked;
        bool isStaking;
    }

    mapping(address => StakingInfo) public stakingInfo;

    bool public stopped = false;

    modifier runIn() {
        require(!stopped);
        _;
    }
    modifier stopIn() {
        require(stopped);
        _;
    }

    event Deposit(address indexed user, uint256 amount, uint256 timestamp);
    event Withdraw(address indexed user, uint256 amount, uint256 timestamp);

    constructor(address _token) {
        stakingToken = IERC20Token(_token);
        owner = msg.sender;
    }

    function updateStoped(bool _stopped) external {
        require(msg.sender == owner, "You are not the owner of the contract");
        stopped = _stopped;
    }

    // openzepplin의 Ownable.sol을 사용해도 되지만, 지금처럼 owner 메소드가 별로 없을 경우 아래와 같이 사용해도 괜찮습니다.
    function setInterest(uint256 _interestInPercents) public returns (bool) {
        require(msg.sender == owner, "You are not the owner of the contract");
        require(_interestInPercents < 100, "Interest cannot be 100%");
        for (uint8 i = 0; i < stakers.length; i++) {
            if (stakingInfo[stakers[i]].isStaking) {
                uint256 holdPeriod = block.timestamp -
                    stakingInfo[stakers[i]].holdStart;
                uint256 reward = (holdPeriod * interestPerSecond) *
                    (stakingInfo[stakers[i]].stakingBalance / 1e18);
                stakingInfo[stakers[i]].accruedRewards =
                    stakingInfo[stakers[i]].accruedRewards +
                    reward;
                stakingInfo[stakers[i]].holdStart = block.timestamp;
            }
        }
        interestPerSecond =
            (1e18 * _interestInPercents) /
            100 /
            365 /
            24 /
            60 /
            60;
        return true;
        // interestPerSecond 값이 잘못 업데이트 될 가능성은 없나요?
        // interestPerSecond 값이 특정 범위에 속해야 한다면, 코드를 그렇게 작성하는 것이 좋습니다.
        // ex) require(_interestPerSecond < MAX_PER_REWARD, "Reward should be small 100000")

        // 필요한 상황을 확인하는 것을 Guard Check Pattern이라고 부르기도 합니다.
        // 다음과 같은 경우 Guard Check 패턴 사용
        // 1. 사용자 입력을 확인
        // 2. 로직을 실행하기 전에 계약 상태를 확인
        // 3. 코드에서 불변성 (immuatable) 을 확인
        // 4. 가능하지 않아야 하는 조건을 배제

        // require, revert, assert의 사용 케이스에 대해 정확히 이해를 해야 합니다.
        // 보통 'require()'는 유효성 검사를 위해 함수의 시작 부분에 주로 사용. 사용하지 않은 가스는 환불
        // 'assert()' 메서드는 함수의 끝에서 사용되며 심각한 오류만 방지
        // 예외의 경우 'revert()'를 사용하며, 사용하지 않은 가스는 환불
    }

    function stakeTokens(uint256 _amount) public runIn {
        require(_amount > 0, "You cannot stake nothing");
        uint256 _senderBalance = stakingToken.balanceOf(msg.sender);
        require(_senderBalance >= _amount, "You do not have enough tokens");

        if (stakingInfo[msg.sender].owner == address(0)) {
            stakingInfo[msg.sender] = StakingInfo(
                msg.sender,
                0,
                0,
                0,
                0,
                false,
                false
            );
        }

        StakingInfo storage _stakingInfo = stakingInfo[msg.sender];
        if (_stakingInfo.isStaking) {
            uint256 holdPeriod = block.timestamp - _stakingInfo.holdStart;
            uint256 reward = (holdPeriod * interestPerSecond) *
                (_stakingInfo.stakingBalance / 1e18);
            _stakingInfo.accruedRewards = _stakingInfo.accruedRewards + reward;
        }

        // 외부 컨트랙트의 사용은 항상 주의해야 합니다.
        // transferring tokens from holder to the contract.
        // transferFrom의 경우 approve가 필요합니다. Staking Contract가 user의 nasgmToken을 전송할 수 있게 approve가 되는지 확인 필요
        // 추가로 transferFrom이 실패할 경우도 코드에 예외 처리를 해줘야 합니다. 컨트랙트에서는 DB에서처럼 모든 조건이 만족해야
        bool success = stakingToken.transferFrom(
            msg.sender,
            address(this),
            _amount
        );
        require(
            success == true,
            "You could not statke token. Failed to transfer token."
        );

        //increasing staking balance of the caller
        _stakingInfo.stakingBalance = _stakingInfo.stakingBalance + _amount;
        //storing the start of the new period
        _stakingInfo.holdStart = block.timestamp;
        if (!_stakingInfo.hasStaked) {
            stakers.push(msg.sender);
        }
        _stakingInfo.isStaking = true;
        _stakingInfo.hasStaked = true;

        //TOTAL VALUE STAKED IN THE CONTRACT
        totalValueLocked = totalValueLocked + _amount;

        emit Deposit(msg.sender, _amount, block.timestamp);
    }

    function claimableRewards() public view returns (uint256) {
        StakingInfo storage _stakingInfo = stakingInfo[msg.sender];
        if (_stakingInfo.holdStart == 0) return _stakingInfo.accruedRewards;

        if (_stakingInfo.stakingBalance == 0)
            return _stakingInfo.accruedRewards;

        // if (_stakingInfo.holdStart > block.timestamp)
        //     return _stakingInfo.accruedRewards;

        if (_stakingInfo.isStaking) {
            uint256 holdPeriod = block.timestamp - _stakingInfo.holdStart;
            uint256 reward = interestPerSecond *
                (_stakingInfo.stakingBalance / 1e18) *
                holdPeriod;
            return _stakingInfo.accruedRewards + reward;
        } else {
            return _stakingInfo.accruedRewards;
        }
    }

    function claimRewards() public {
        StakingInfo storage _stakingInfo = stakingInfo[msg.sender];

        if (_stakingInfo.isStaking) {
            uint256 holdPeriod = block.timestamp - _stakingInfo.holdStart;
            uint256 reward = interestPerSecond *
                (_stakingInfo.stakingBalance / 1e18) *
                holdPeriod;
            _stakingInfo.accruedRewards = _stakingInfo.accruedRewards + reward;
            _stakingInfo.paidOutRewards =
                _stakingInfo.paidOutRewards +
                _stakingInfo.accruedRewards;

            if (_stakingInfo.accruedRewards > 0) {
                bool success = stakingToken.transferFrom(
                    owner,
                    msg.sender,
                    _stakingInfo.accruedRewards
                );
                require(
                    success == true,
                    "You could not receive reward. Failed to transfer token."
                );
                _stakingInfo.accruedRewards = 0;
            }
            _stakingInfo.holdStart = block.timestamp;
        } else {
            if (_stakingInfo.accruedRewards > 0) {
                bool success = stakingToken.transferFrom(
                    owner,
                    msg.sender,
                    _stakingInfo.accruedRewards
                );
                require(
                    success == true,
                    "You could not receive reward. Failed to transfer token."
                );
                _stakingInfo.paidOutRewards =
                    _stakingInfo.paidOutRewards +
                    _stakingInfo.accruedRewards;
                _stakingInfo.accruedRewards = 0;
            }
            _stakingInfo.holdStart = 0;
        }
    }

    function unstakeTokens(uint256 _amount) public {
        StakingInfo storage _stakingInfo = stakingInfo[msg.sender];

        require(
            _stakingInfo.stakingBalance >= _amount,
            "Cannot unstake more than you staked"
        );
        uint256 holdPeriod = block.timestamp - _stakingInfo.holdStart;
        uint256 reward = interestPerSecond *
            (_stakingInfo.stakingBalance / 1e18) *
            holdPeriod;
        _stakingInfo.accruedRewards = _stakingInfo.accruedRewards + reward;
        bool success = stakingToken.transfer(msg.sender, _amount);
        require(success == true, "Something went wrong");
        _stakingInfo.stakingBalance = _stakingInfo.stakingBalance - _amount;
        totalValueLocked = totalValueLocked - _amount;
        if (_stakingInfo.stakingBalance > 0) {
            _stakingInfo.isStaking = true;
            _stakingInfo.holdStart = block.timestamp;
        } else if (_stakingInfo.stakingBalance == 0) {
            _stakingInfo.isStaking = false;
            _stakingInfo.holdStart = 0;
        }
        emit Withdraw(msg.sender, _amount, block.timestamp);
    }
}
