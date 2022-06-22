const { ethers } = require("hardhat")
//METHODS: For using ChainlinkVRF 
//1. Get SubID for Chainklink VRF & Fund
//2. Deploy our contract using the Subid
//3.Register the contract with Chainlin VRD and its' subiD
//4. Register the contract with Chainlink Keepers
//5. Run Staging Test


const networkConfig =  {
    4: { 
        name: "rinkeby",
        vrfCoordinatorV2: "0x6168499c0cFfCaCD319c818142124B7A15E857ab",
        //hard coded the entry fee
        entranceFee: ethers.utils.parseEther("0.01"),
        gasLane: "0xd89b2bf150e3b9e13446986e571fb9cab24b13cea0a43ea20a6049a85cc807cc",
        subscriptionId: "6990", //need THIS!
        callbackGasLimit: "500000",
        interval: "30"
    },
    31337: { 
        name: "hardhat",
        entranceFee: ethers.utils.parseEther("0.01"),
        gasLane: "0xd89b2bf150e3b9e13446986e571fb9cab24b13cea0a43ea20a6049a85cc807cc",
        callbackGasLimit: "500000",
        interval: "30"


    }
}

const devChains = ["hardhat", "localhost"]
module.exports = { 
    networkConfig,
    devChains
}