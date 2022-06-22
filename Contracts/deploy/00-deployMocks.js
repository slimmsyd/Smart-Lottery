const { network, ethers } = require("hardhat")
const {devChains} = require("../helper-hardhatconfig")

const BASE_FEE = ethers.utils.parseEther("0.25") //Premimum for LINK request
const GAS_PRICE_LINK = 1e9;


module.exports = async({getNamedAccounts, deployments}) => { 
    const {deploy, log} = deployments
    const {deployer} = await getNamedAccounts()
    const chainId = network.config.chainId;

    if(devChains.includes(network.name)) { 
        log("Local network detected.... deploying mocks...");
        await deploy("VRFCoordinatorV2Mock", { 
            from: deployer,
            log: true,
            args: [BASE_FEE, GAS_PRICE_LINK]
        })
        log("Mock Deployed")
        log("=======================")
    }
}

module.exports.tags = ["all", "mocks"]