

module.exports = async ({getNamedAccounts, deployments}) => {
    const {deploy} = deployments;
    const {firstAccount} = await getNamedAccounts();
    
  const boxLottery = await deploy("BoxLottery", {
        from: firstAccount,
        args: [],
        log: true,
        waitConfirmations: 1,
    })
    console.log("BoxLottery deployed to:", boxLottery.address);
}

module.exports.tags = ["BoxLottery",'all'];
