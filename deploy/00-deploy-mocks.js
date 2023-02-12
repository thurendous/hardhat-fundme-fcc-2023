const { network } = require("hardhat")
const {
    developmentChains,
    DECIMALS,
    INITIAL_ANSWER,
    networkConfig,
} = require("../helper-hardhat-config")

module.exports = async () => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId
    const chainName = network
    // log(developmentChains, chainName)

    if (developmentChains.includes(network.name)) {
        log("Local network detected! Deploying Mocks...")
        await deploy("MockV3Aggregator", {
            from: deployer,
            log: true,
            args: [DECIMALS, INITIAL_ANSWER],
        })
        log("Mocks deployed successfully")
        log(
            "↑01-deploy----------------------------------------------------------------"
        )
    } else {
        log("no local network detected! Moving to next step...")
        log(
            "↑01-deploy----------------------------------------------------------------"
        )
    }
}

module.exports.tags = ["all", "mocks"]
