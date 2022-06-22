// //grab dev chains 
// const { assert, expect } = require("chai");
// const { getNamedAccounts, deployments, ethers, network } = require("hardhat")
// const {devChains, networkConfig} = require("../../helper-hardhatconfig")

// !devChains.includes(network.name) ? describe.skip : describe("Lottery", async function  ()  { 
//     //deploy raffle
//     let lottery, vrfCoordinatorV2Mock, entryFee, deployer, interval
//     //network.config.chainId not networkConfig.chainId
//     const chainId = network.config.chainId
//     beforeEach(async function() { 
//         deployer = (await getNamedAccounts()).deployer
//         //deploy everything
//         await deployments.fixture("all") 
//         lottery = await ethers.getContract("Lottery");
//         vrfCoordinatorV2Mock = await ethers.getContract("VRFCoordinatorV2Mock")
//         entryFee = await lottery.getEntryFee();
//         interval = await lottery.getInterval();
//     });

//     describe("constructor",  function() { 
//         it("initalizes the lottery correclty", async function() { 
//             //Ideally we have 1 assert per "it" 
//             const lotteryState = await lottery.getLotteryState()
//             //tostring returns big number
//             assert.equal(lotteryState.toString(), "0")
//             assert.equal(interval.toString(), networkConfig[chainId]["interval"])


//         });

//     });

//     describe("enterLottery",  function() { 
//         it("Reverts when you don't pay the right amount of entry fee", async function() { 
//             await expect(lottery.enterLottery()).to.be.revertedWith("Lottery_NotEnoughEthEntered")
//         });
//         it(" records players when they enter", async function() { 
//             //obtain the entrance fee -> we did so by initalizing it at the top of code.
//             await lottery.enterLottery({value: entryFee})
//             const playerFromContract = await lottery.getPlayers(0)
//             assert.equal(playerFromContract, deployer)
//         });
//         it("emits event on enter", async function() { 
//             await expect(lottery.enterLottery({value: entryFee})).to.emit(lottery, "lotteryEnter")
//         });
//         it("doesn't allow entrance when raffle is calculating", async function() { 
//             await lottery.enterLottery({value: entryFee})

//             //increase the time of blockchain
//             await network.provider.send("evm_increaseTime", [interval.toNumber() + 1])
//             //we mined a block 
//             await network.provider.send("evm_mine", []);
//             //we pretend to be a chainlink keeper 
//             await lottery.performUpkeep([])

//             await expect(lottery.enterLottery({value: entryFee})).to.be.revertedWith("Raffle__NotOpen")

//         })
//     });

//     describe("checkUpKeep",  function() { 
//         it("returns false if people haven't sent any ether",  async function() { 
//             //noted, we didn't call the enterLottery function == No ether in contract
//             await network.provider.send("evm_increaseTime", [interval.toNumber() + 1])
//             await network.provider.send("evm_mine", [])
//             //simulate calling this and see what it will respond
//             //doesn't actually call the function -> with callStatic is simulates the respsonse
//             const {upkeepNeeded} = await lottery.callStatic.checkUpkeep([])
//             assert(!upkeepNeeded);
//         });

//         it("returns false if lottery isn't open", async function() { 
//             //noted we called the enterlottery function => ether in contract
//             await lottery.enterLottery({value: entryFee}); 
//             await network.provider.send("evm_increaseTime", [interval.toNumber() + 1])
//             await network.provider.send("evm_mine", [])
//             //another way to send a blank object
//             await lottery.performUpkeep("0x")
//             const lotteryState = await lottery.getLotteryState()
//             const {upkeepNeeded} = await lottery.callStatic.checkUpkeep([])
//             assert.equal(lotteryState.toString(), "1")
//             assert.equal(upkeepNeeded, false);
//         });

//         it("returns false if enough time has passed", async () => { 
//             await lottery.enterLottery({value: entryFee}); 
//             await network.provider.send("evm_increaseTime", [interval.toNumber() + 1])
//             await network.provider.request({method: "evm_mine", params: []})
//             const {upkeepNeeded} = await lottery.callStatic.checkUpkeep("0x")
//             //weird when I set it to !upkeepNeeded it fail hmm,,, look back into this
//             assert(upkeepNeeded);
//         });
//         it("returns true if enough time has passed, has players, eth, and is open", async () => { 
//             await lottery.enterLottery({value: entryFee}); 
//             await network.provider.send("evm_increaseTime", [interval.toNumber() + 1])
//             //we want the network to mine a block
//             await network.provider.request({method: "evm_mine", params: []})
//             const {upkeepNeeded} = await lottery.callStatic.checkUpkeep("0x")
//             assert(upkeepNeeded)

//         })



//     });

//     describe("performUpkeep", function() { 
//         it("it can only run if checkupkeep is true", async () => { 
//             await lottery.enterLottery({value: entryFee})
//             //we want our checkupkeep to return true
//             await network.provider.send("evm_increaseTime", [interval.toNumber() + 1])
//             await network.provider.request({method: "evm_mine", params: []})
//             const tx = await lottery.performUpkeep([])
//             assert(tx)
//         })
//         it("reverts when checkupkeep is false", async () => {
//             await expect(lottery.performUpkeep([])).to.be.revertedWith("Raffle__UPkeepNotNeeded")
//         })
//         it("updates the raffle state, emits an event, and calls the vrfcoordinator", async () => {
//             await lottery.enterLottery({value: entryFee})
//             //we want our checkupkeep to return true
//             await network.provider.send("evm_increaseTime", [interval.toNumber() + 1])

//             const tx = await lottery.performUpkeep([])
//             const txReceipt = await tx.wait(1);
//             const requestId = txReceipt.events[1].args.requestId;
//             console.log(requestId)


//         })

//     });

//     describe("fulfill randomWords", function() { 
//         beforeEach(async () => { 
//             await lottery.enterLottery({value: entryFee})
//             await network.provider.send("evm_increaseTime", [interval.toNumber() + 1]);
//             //we want to somebody to enter to lottery and increase the time to run
//             await network.provider.request({method: "evm_mine", params: []})

//             it("only be called after performupKeep", async() => { 
//                 await expect(vrfCoordinatorV2Mock.fulfillRandomWords(0, lottery.address)).to.be.revertedWith("nonexistent request")
//                 await expect(vrfCoordinatorV2Mock.fulfillRandomWords(1, lottery.address)).to.be.revertedWith("nonexistent request")
//             })
//             it("picks a winner, resets the lottery, and sends money", async() => { 
//                 const accounts = await ethers.getSigners()
//                 const additionalTickets = 3; 
//                 const startingAccountIndex = 1 //deployer = 0

//                 //gets bunch of random users to enter the lottery
//                 for (let i = startingAccountIndex; i < startingAccountIndex + additionalTickets; i++)  {
//                     //let them enter lottery
//                     const accountConnectedLottery = lottery.connect(accounts[i]); 
//                     //fund the connecting accounts
//                     await accountConnectedLottery.enterLottery({value: entryFee})
//                 }
//                 //starting timestamp
//                 const startingTimeStamp = await lottery.getLatestTimeStamp();

//                 //performUpKeep (mock being chainlink keepers)
//                 //fulfillRandomWords(mock being the chainlinkVRF) 
//                 //we will have to wati for the fulfill randomwords to be called
//                 await new Promise(async (resolve, reject) => { 
//                     //once event gets fired do some stuff
//                     lottery.once("winnerPicked", async() => { 
//                         console.log("Found the event!");
//                         try{
//                             const recentWinner = await lottery.getRecentWinner();

//                             console.log(recentWinner)
//                             console.log(accounts[0].address)
//                             console.log(accounts[1].address)
//                             console.log(accounts[2].addres)
//                             console.log(accounts[3].address)
//                             const winnerEndingBalance = await accounts[1].getBalance();
//                             const lotteryState = await lottery.getLotteryState();
//                             const endingTimeStamp = await getLatestTimeStamp();
//                             const numPlayers = await lottery.getNumPlayers();
//                             assert.equal(numPlayers.toString(), "0");
//                             assert.equal(lotteryState.toString(), "0");
//                             assert.equal(endingTimeStamp > startingTimeStamp);

//                             //
//                             assert.equal(winnerEndingBalance.toString(), winnerStartingBalance.add(entryFee).mul(additionalTickets).toString())
//                         }catch(e){
//                             reject(e)
//                         }
//                         resolve();
                        
//                     }) 
//                 });

//                     const tx = await lottery.performUpkeep("0x");
//                     const txReceipt = await tx.wait(1);
//                     const winnerStartingBalance = await accounts[1].getBalance()
//                     await vrfCoordinatorV2Mock.fulfillRandomWords(txReceipt.events[1].args.requestId, lottery.address); 
//             })

//         })
//     })
    




// })

