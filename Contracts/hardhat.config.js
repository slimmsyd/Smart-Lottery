require("@nomiclabs/hardhat-waffle")
require("@nomiclabs/hardhat-ethers")
require("@nomiclabs/hardhat-etherscan")
require("hardhat-deploy")
require("solidity-coverage")
require("hardhat-gas-reporter")
require("dotenv").config()
require("hardhat-contract-sizer")

const ALCHEMY_KEY_RINKEBY = process.env.ALCHEMY_KEY_RINKEBY;
const RINKEBY_KEY = process.env.RINKEBY_KEY;
const ETHER_SCAN_API = process.env.ETHER_SCAN_API;

module.exports = {
  solidity: "0.8.8",
  namedAccounts: {
    deployer: { 
      default: 0
    },
    player: {
      default: 1
    }
  },
  defaultNetwork: "hardhat",
  networks: { 
    hardhat: { 
      chainId: 31337,
      blockConfirmations: 1,
    },
    rinkeby: { 
      chainId: 4,
      blockConfirmations: 6,
      url: ALCHEMY_KEY_RINKEBY,
      accounts: [RINKEBY_KEY],
      saveDeployments: true,
    },
  
  }, 
  etherscan: { 
    apiKey: { 
      rinkeby: ETHER_SCAN_API
    }
  },gasReporter: {
    enabled: false,
    outputFile: "gas-report.txt",
    noColors: true,
    currencey: "USD",
  },
  mocha: { 
    timeout: 300000 //300s max => depending on how fast rinkeby testnet is(may need to bump up)
  }
};
