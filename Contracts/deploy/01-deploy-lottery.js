const { network, ethers } = require("hardhat")
const { devChains, networkConfig } = require("../helper-hardhatconfig")
const {verify} = require("../utils/verify")
const VRF_FUND_AMOUNT = ethers.utils.parseEther("2")


module.exports = async({getNamedAccounts, deployments}) => { 
    const {deploy, log} = deployments
    const {deployer} = await getNamedAccounts()
    const chainId = network.config.chainId
    let vrfCoordinatorV2address, subscriptionId

    if(devChains.includes(network.name)) { 
        const vrfCoordinatorV2Mock = await ethers.getContract("VRFCoordinatorV2Mock");
        vrfCoordinatorV2address = vrfCoordinatorV2Mock.address
        //create subscription, function directly inputed in vrfcorrdinator
        const tx = await vrfCoordinatorV2Mock.createSubscription();
        const txRe = await tx.wait(1);
        subscriptionId = txRe.events[0].args.subId
        //fund the subscription => direcly inputed from vrfcordinator
        await vrfCoordinatorV2Mock.fundSubscription(subscriptionId,VRF_FUND_AMOUNT )
    }else { 
        vrfCoordinatorV2address = networkConfig[chainId]["vrfCoordinatorV2"]
        subscriptionId = networkConfig[chainId]["subscriptionId"]
    }
    const interval = networkConfig[chainId]["interval"]
    const callbackGasLimit = networkConfig[chainId]["callbackGasLimit"]
    const gasLane = networkConfig[chainId]["gasLane"]
    const entranceFee = networkConfig[chainId]["entranceFee"]
    const args = [vrfCoordinatorV2address, entranceFee, gasLane,subscriptionId,callbackGasLimit,interval]
    const contract = await deploy("Lottery", { 
        from: deployer,
        log: true,
        args: args,
        waitConfirmations: network.config.blockConfirmations || 1
    })

    if(!devChains.includes(network.name) && process.env.ETHER_SCAN_API) { 
        log("Verifying on testnet.....")
        await verify(contract.address, args)
    }
    

    log("==============================================")

}

module.exports.tags = ["all", "lottery"]