// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {ERC721Burnable} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import {ERC721Enumerable} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import {ERC721URIStorage} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract NFTToken is ERC721, ERC721Enumerable, ERC721URIStorage, ERC721Burnable, Ownable {
    uint256 private _nextTokenId;
    string constant METADATA_URI = "ipfs://QmatiLZoj7PZwU3gcqMwAhN5QmN1GoBuxjRWbk9DxQZtfB";
    
    // 授权地址映射
    mapping(address => bool) public authorizedMinters;
    // 记录授权地址铸造次数
    mapping(address => uint256) public minterMintCount;
    
    // 事件
    event MinterAuthorized(address indexed minter);
    event MinterRevoked(address indexed minter);
    event TokenMinted(address indexed minter, address indexed to, uint256 tokenId);
    
    constructor(string memory _name, string memory _symbol)
        ERC721(_name, _symbol)
        Ownable(msg.sender)
    {}
    
    // 修饰器：检查是否是授权地址并且未超过铸造限制
    modifier onlyAuthorizedMinter() {
        bool isOwner = owner() == _msgSender();
        bool isAuthorized = authorizedMinters[_msgSender()];
        bool withinLimit = minterMintCount[_msgSender()] < 100;
        
        require(
            isOwner || (isAuthorized && withinLimit),
            "Not authorized to mint or limit reached"
        );
        _;
    }
    
    // 授权地址可以铸造
    function safeMint(address to) public onlyAuthorizedMinter returns (uint256) {
        uint256 tokenId = _nextTokenId++;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, METADATA_URI);
        
        // 如果是授权地址（非所有者），增加铸造计数
        if (_msgSender() != owner()) {
            minterMintCount[_msgSender()]++;
        }
        
        emit TokenMinted(_msgSender(), to, tokenId);
        return tokenId;
    }
    
    // 添加授权地址
    function addMinter(address minter) external onlyOwner {
        require(minter != address(0), "Invalid minter address");
        require(!authorizedMinters[minter], "Minter already authorized");
        authorizedMinters[minter] = true;
        // 重置铸造计数
        minterMintCount[minter] = 0;
        emit MinterAuthorized(minter);
    }
    
    // 移除授权地址
    function removeMinter(address minter) external onlyOwner {
        require(authorizedMinters[minter], "Minter not authorized");
        authorizedMinters[minter] = false;
        // 清除铸造计数
        delete minterMintCount[minter];
        emit MinterRevoked(minter);
    }
    
    // 检查地址是否有铸造权限
    function isMinter(address account) public view returns (bool) {
        if (owner() == account) return true;
        return authorizedMinters[account] && minterMintCount[account] == 0;
    }
    
    // 查询授权地址已铸造的 NFT 数量
    function getMinterMintCount(address minter) external view returns (uint256) {
        return minterMintCount[minter];
    }
    
    // 重置授权地址的铸造次数（只有合约拥有者可以调用）
    function resetMinterMintCount(address minter) external onlyOwner {
        require(authorizedMinters[minter], "Address is not an authorized minter");
        minterMintCount[minter] = 0;
    }

    // The following functions are overrides required by Solidity.

    function _update(address to, uint256 tokenId, address auth)
        internal
        override(ERC721, ERC721Enumerable)
        returns (address)
    {
        return super._update(to, tokenId, auth);
    }

    function _increaseBalance(address account, uint128 value)
        internal
        override(ERC721, ERC721Enumerable)
    {
        super._increaseBalance(account, value);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}