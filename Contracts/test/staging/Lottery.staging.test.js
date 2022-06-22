const { assert, expect } = require("chai");
const { getNamedAccounts, deployments, ethers, network } = require("hardhat");
const {devChains} = require("../../helper-hardhatconfig")

//checking if we are on a developmentchain: If so do your thang baby
devChains.includes(network.name) ? describe.skip : 

describe("Lottery", async function  ()  { 
    //deploy raffle
    let lottery, vrfCoordinatorV2Mock, entryFee, deployer, interval

    beforeEach(async function() { 
        deployer = (await getNamedAccounts()).deployer
        //deploy everything
        await deployments.fixture("all") 
        lottery = await ethers.getContract("Lottery");
        entryFee = await lottery.getEntryFee();
        interval = await lottery.getInterval();
    });

    describe("fulfillRandomWords", function () {
        it("works with live Chainlink Keepers and Chainlink VRF, we get a random winnner", async function() { 
            //get timestamp
            const startingTimeStamp = await lottery.getLatestTimeStamp();
            console.log(`Starting Time Stamp: ${startingTimeStamp}`)
            const accounts = await ethers.getSigners()
            //setup listener before we enter the raffle -> just incase blockchain moves really fast
            await new Promise( async(resolve, reject) => {
                lottery.once("winnerPicked", async() => { 
                    console.log("Winner event fired!");
                    try { 

                        //asserts
                        const recentWinner = await lottery.getRecentWinner();
                        const lotteryState = await lottery.getLotteryState();
                        const winnerEndingBalance = await accounts[0].getBalance();
                        console.log(`Winner Ending Balance: ${winnerEndingBalance}`)

                        const endingTimeStamp = await lottery.getLatestTimeStamp();
                        console.log(`Ending Time Stamp: ${startingTimeStamp}`)
                        //should get reverted/ players array reset
                        await expect(lottery.getPlayer(0)).to.be.reverted
                        //winner should be the first account mentioned
                        assert.equal(recentWinner.toString(), accounts[0].address);
                        //reset the lottery state to enmum 0 => OPEN
                        assert.equal(lotteryState, 0);
                        //winnerStarting Blaance should be updated
                        assert.equal(winnerStartingBalance.toString(), winnerEndingBalance.add(entryFee).toString())

                        //timestamp should of changed
                        assert(endingTimeStamp > startingTimeStamp);
                        resolve();

                    }catch(e) { 
                        reject(e)
                    }

                })
                console.log("Entering lottery.....")
                const tx = await lottery.enterLottery({value: entryFee})
                tx.wait(1);
                console.log("Okay, time to wait....");
                const winnerStartingBalance = await accounts[0].getBalance();

            });




        })  
    })

})