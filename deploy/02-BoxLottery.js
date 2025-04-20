
module.exports = async ({getNamedAccounts, deployments}) => {
    const {deploy, get} = deployments;
    const {firstAccount} = await getNamedAccounts();

    try {
        // 获取当前网络
        const waitConfirmations = network.config.chainId === 11155111 ? 2: 1;

        // 确保 NFTToken 已经部署
        const NFTToken = await get("NFTToken");
        console.log("Found NFTToken at:", NFTToken.address);

        // 部署 BoxLottery
        const boxLottery = await deploy("BoxLottery", {
            from: firstAccount,
            args: [],
            log: true,
            waitConfirmations: waitConfirmations,
        });
        
        console.log("BoxLottery deployed to:", boxLottery.address);

        // 获取合约实例
        const nftToken = await ethers.getContractAt("NFTToken", NFTToken.address);
        const BoxLotteryContract = await ethers.getContractAt("BoxLottery", boxLottery.address);

        // 设置 NFTToken 地址
        console.log("Setting NFTToken address in BoxLottery...");
        const setTx = await BoxLotteryContract.setNFTTokenContract(NFTToken.address);
        await setTx.wait(waitConfirmations);
        console.log("Set NFTToken address in BoxLottery");

        // 添加 BoxLottery 为铸造者
        console.log("Adding BoxLottery as minter...");
        const addMinterTx = await nftToken.addMinter(boxLottery.address);
        await addMinterTx.wait(waitConfirmations);
        console.log("Added BoxLottery as minter");

        // 如果是 Sepolia 网络，验证合约
        if (network.config.chainId === 11155111&&process.env.ETHERSCAN_API_KEY) {
            console.log("Waiting for block confirmations before verification...");
            // await sleep(60000); // 等待 1 分钟

            try {
                await run("verify:verify", {
                    address: boxLottery.address,
                    constructorArguments: [],
                });
                console.log("BoxLottery verified successfully");
            } catch (error) {
                console.log("Error verifying BoxLottery:", error.message);
            }
        }

    } catch (error) {
        console.error("Error during deployment:", error);
        throw error;
    }
};

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports.dependencies = ["NFTToken"];
module.exports.tags = ["BoxLottery", "all"];