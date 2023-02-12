// usually we do like this: import, then main function, calling the main function

// a little bit different
// function deployFunc(hre) {
//     console.log("hi!")
// hre.getNameAccounts()
// hre.deployments()
// }

// module.exports.default = deployFunc
const { networkConfig, developmentChains } = require("../helper-hardhat-config")
const { network } = require("hardhat")
const { verify } = require("../utils/verify")

module.exports = async ({ getNameAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId
    log(deployer)
    log(chainId)
    let ethUsdPriceFeedAddress

    if (developmentChains.includes(network.name)) {
        const ethUsdAggregator = await deployments.get("MockV3Aggregator")
        ethUsdPriceFeedAddress = ethUsdAggregator.address
    } else {
        ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"]
    }

    // if the conract is not there, we create a minimal version of it for our local testnet.

    // well what happens when we want to change chains
    // when going for localhost or hardhat network we want to use a mock

    // if chainId is X use address Y
    // if chainId is Z use address A
    const args = [ethUsdPriceFeedAddress]
    const fundMe = await deploy("FundMe", {
        from: deployer,
        log: true,
        args: args,
        waitConfirmations: network.config.blockConfirmations || 1,
        // [
        /* address */
        // ethUsdPriceFeedAddress,
        // ], // put price feed address into this
    })

    console.log(`verifying contract`)
    if (
        !developmentChains.includes(network.name) &&
        process.env.ETHERSCAN_API_KEY
    ) {
        console.log(`in verifying process...`)
        await verify(fundMe.address, args)
    }
    log(
        "↑02-deploy----------------------------------------------------------------"
    )
}

module.exports.tags = ["all", "fundme"]
