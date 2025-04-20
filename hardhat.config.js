require("@nomicfoundation/hardhat-toolbox");
require("@nomicfoundation/hardhat-ethers");
require("hardhat-deploy");
require("hardhat-deploy-ethers");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.20",
  networks: {
    hardhat: {
      chainId: 1337
    },
    // 这里可以添加其他网络配置
    localhost: {
      url: "http://127.0.0.1:7545",
      accounts: [
        "0x2284a2f4456925735fdd84c0d4afaef87d33741424e5fe89c0062a20b47bb4b6",
      ],
    },
  },
  paths: {
    artifacts: './app/artifacts',
  },
  namedAccounts: {
    firstAccount: {
      default: 0,
    },
  },
};
