const { ethers } = require("hardhat");

module.exports = async ({getNamedAccounts, deployments}) => {
    const {deploy} = deployments;
    const {firstAccount} = await getNamedAccounts();

    const nftToken = await deploy("NFTToken", {
        from: firstAccount,
        args: ["LotteryNFT", "LNFT"],
        log: true,
        waitConfirmations: 1,
    });
    
    console.log("NFTToken deployed to:", nftToken.address);

    // 获取已部署的合约实例
    const NFTToken = await ethers.getContract("NFTToken", firstAccount);
    const BoxLottery = await ethers.getContract("BoxLottery", firstAccount);

    // 将 BoxLottery 合约添加为授权铸造者
    const addMinterTx = await NFTToken.addMinter(BoxLottery.target);
    await addMinterTx.wait();
    console.log("Added BoxLottery as minter:", BoxLottery.target);
}

module.exports.tags = ["NFTToken",'all'];
