// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./NFTToken.sol";

contract BoxLottery is Ownable, ReentrancyGuard {
    // 奖品类型枚举
    enum PrizeType {
        NOTHING,    // 谢谢惠顾
        SMALL_ETH,  // 0.002 ETH
        MEDIUM_ETH, // 0.1 ETH
        LARGE_ETH,  // 1 ETH
        NFT        // NFT奖励
    }

    // 格子状态结构
    struct Box {
        bool opened;
        PrizeType prizeType;
        bool claimed;
    }

    // 状态变量
    uint256 public constant TOTAL_BOXES = 100;
    uint256 public constant PRICE_PER_BOX = 0.015 ether;
    uint256 public constant SMALL_PRIZE = 0.002 ether;
    uint256 public constant MEDIUM_PRIZE = 0.1 ether;
    uint256 public constant LARGE_PRIZE = 1 ether;
    
    mapping(uint256 => Box) public boxes;
    
    // NFTToken 合约
    NFTToken public nftToken;
    
    // 事件
    event BoxOpened(address indexed player, uint256 boxId, PrizeType prizeType);
    event PrizeClaimed(address indexed player, uint256 boxId, PrizeType prizeType);
    event NFTTokenContractSet(address indexed nftTokenContract);

    constructor() Ownable(msg.sender) {
        _initializeBoxes();
    }

    // 设置 NFTToken 合约地址
    function setNFTTokenContract(address _nftToken) external onlyOwner {
        require(_nftToken != address(0), "Invalid NFT token address");
        nftToken = NFTToken(_nftToken);
        emit NFTTokenContractSet(_nftToken);
    }

    // 初始化所有格子
    function _initializeBoxes() private {
        uint256[] memory indices = new uint256[](TOTAL_BOXES);
        for(uint256 i = 0; i < TOTAL_BOXES; i++) {
            indices[i] = i;
        }

        // Fisher-Yates 洗牌算法
        for(uint256 i = TOTAL_BOXES - 1; i > 0; i--) {
            uint256 j = uint256(keccak256(abi.encodePacked(block.timestamp, i))) % (i + 1);
            (indices[i], indices[j]) = (indices[j], indices[i]);
        }

        // 分配奖品
        uint256 currentIndex = 0;
        
        // 分配1个大奖 (1 ETH)
        boxes[indices[currentIndex++]] = Box(false, PrizeType.LARGE_ETH, false);
        
        // 分配3个中奖 (0.1 ETH)
        for(uint256 i = 0; i < 3; i++) {
            boxes[indices[currentIndex++]] = Box(false, PrizeType.MEDIUM_ETH, false);
        }
        
        // 分配15个小奖 (0.002 ETH)
        for(uint256 i = 0; i < 15; i++) {
            boxes[indices[currentIndex++]] = Box(false, PrizeType.SMALL_ETH, false);
        }
        
        // 分配6个NFT奖励
        for(uint256 i = 0; i < 6; i++) {
            boxes[indices[currentIndex++]] = Box(false, PrizeType.NFT, false);
        }
        
        // 剩余的都是谢谢惠顾
        for(uint256 i = currentIndex; i < TOTAL_BOXES; i++) {
            boxes[indices[i]] = Box(false, PrizeType.NOTHING, false);
        }
    }

    // 打开盒子
    function openBox(uint256 boxId) external payable nonReentrant {
        require(boxId < TOTAL_BOXES, "Invalid box ID");
        require(!boxes[boxId].opened, "Box already opened");
        require(msg.value == PRICE_PER_BOX, "Incorrect payment amount");

        boxes[boxId].opened = true;
        
        emit BoxOpened(msg.sender, boxId, boxes[boxId].prizeType);
    }

    // 领取奖品
    function claimPrize(uint256 boxId) external nonReentrant {
        require(boxId < TOTAL_BOXES, "Invalid box ID");
        require(boxes[boxId].opened, "Box not opened yet");
        require(!boxes[boxId].claimed, "Prize already claimed");
        
        if (boxes[boxId].prizeType == PrizeType.NFT) {
            require(address(nftToken) != address(0), "NFT token contract not set");
            require(nftToken.isMinter(address(this)), "Contract not authorized to mint");
        }
        
        boxes[boxId].claimed = true;
        
        if (boxes[boxId].prizeType == PrizeType.SMALL_ETH) {
            payable(msg.sender).transfer(SMALL_PRIZE);
        } else if (boxes[boxId].prizeType == PrizeType.MEDIUM_ETH) {
            payable(msg.sender).transfer(MEDIUM_PRIZE);
        } else if (boxes[boxId].prizeType == PrizeType.LARGE_ETH) {
            payable(msg.sender).transfer(LARGE_PRIZE);
        } else if (boxes[boxId].prizeType == PrizeType.NFT) {
            nftToken.safeMint(msg.sender);
        }
        
        emit PrizeClaimed(msg.sender, boxId, boxes[boxId].prizeType);
    }

    // 查看盒子状态
    function getBoxStatus(uint256 boxId) external view returns (bool opened, bool claimed) {
        require(boxId < TOTAL_BOXES, "Invalid box ID");
        return (boxes[boxId].opened, boxes[boxId].claimed);
    }

    // 合约拥有者提取资金
    function withdraw() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }

    // 确保合约可以接收ETH
    receive() external payable {}
} 