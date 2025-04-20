// const { ethers } = require("hardhat");

module.exports = async ({getNamedAccounts, deployments}) => {
    const {deploy} = deployments;
    const {firstAccount} = await getNamedAccounts();

    // 获取当前网络
    // const network = await ethers.provider.getNetwork();
    const waitConfirmations = network.config.chainId== 11155111 ? 2: 1; // Sepolia 需要更多确认数

    const nftToken = await deploy("NFTToken", {
        from: firstAccount,
        args: ["LotteryNFT", "LNFT"],
        log: true,
        waitConfirmations: waitConfirmations,
    });
    
    console.log("NFTToken deployed to:", nftToken.address);

    // 如果是 Sepolia 网络，等待足够的区块确认后再验证合约
    if (network.config.chainId === 11155111&&process.env.ETHERSCAN_API_KEY) {
        console.log("Waiting for block confirmations...");
        // await sleep(60000); // 等待 1 分钟
        
        // 验证合约
        try {
            await run("verify:verify", {
                address: nftToken.address,
                constructorArguments: ["LotteryNFT", "LNFT"],
            });
            console.log("NFTToken verified successfully");
        } catch (error) {
            console.log("Error verifying NFTToken:", error.message);
        }
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports.tags = ["NFTToken", "all"];