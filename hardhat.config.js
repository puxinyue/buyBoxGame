require("@nomicfoundation/hardhat-toolbox");
require("@nomicfoundation/hardhat-ethers");
require("hardhat-deploy");
require("hardhat-deploy-ethers");
require("@chainlink/env-enc").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.28",
  networks: {
    hardhat: {},
    // 这里可以添加其他网络配置
    localhost: {
      url: "http://127.0.0.1:7545",
      accounts: [
        "0xf1649024a22ccb1647703a46cdfc9df2e98c769db008197a5dfa3bef4ca4101a",
      ],
    },
    sepolia: {
      url: process.env.SEPOLIA_RPC_URL,
      chainId: 11155111,
      accounts: [process.env.PRIVATE_KEY],
      blockConfirmations: 2,
    },
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
  paths: {
    artifacts: './app/artifacts',
  },
  namedAccounts: {
    firstAccount: {
      default: 0,
    },
  },
  gasReporter:{
    enabled: true
  }
};
