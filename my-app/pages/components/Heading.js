import React, {useState, useEffect} from 'react'; 
import styles from '../../styles/Heading.module.css'



import { ACCOUNT_ADDRESS, CONTRACT_ABI } from '../../constants';
import { Contract, BigNumber, utils } from 'ethers';
import { parseEther } from 'ethers/lib/utils';

const Heading = ({getProviderOrSigner, accountAddress, splitString}) => { 
    //setting bignumber
    const zero = BigNumber.from(0)
    const [loading, setLoading] = useState(false);
    //entry fee
    const [entryFee, setEntryFee] = useState(false); 
    //get lottery state 
    const [lotteryState, setLotteryState] = useState(false);
    //set number of players 
    const [players, setPlayers] = useState(0);
    //get recent winner 
    const [winner, setWinner] = useState('');
    //getlatesttimestanp 
    const [latestTimeStamp, setLatestTimeStamp] = useState(0)
    
    
     useEffect(() => {
        returnEntryFee();
        retunNumberOfPlayers();
        returnLatestWinner();
     })

    //returning entryfree of lottery 
    const returnEntryFee= async() =>  { 

        try  { 
            const signer = await getProviderOrSigner(true); 
            const contract = new Contract(
                ACCOUNT_ADDRESS,
                CONTRACT_ABI,
                signer
            );
            let tx = await contract.getEntryFee(); 
            setLoading(true); 
             setEntryFee(tx)
             return entryFee
         
        }catch(err) {
        console.error(err); 
    }
        
    };

    const retunNumberOfPlayers = async() => {
        try  { 
            const signer = await getProviderOrSigner();
            const contract = new Contract(
                ACCOUNT_ADDRESS,
                CONTRACT_ABI,
                signer
            ); 
            const tx = await contract.getNumPlayers();
            setLoading(true); 
            setPlayers(tx.toString());
            setLoading(false); 
            return players

        }catch(e) { 
            console.error(e)
        }
    }
    
    const joinLottery = async() => { 
        try {
            const signer = await getProviderOrSigner(true);
            const contract = new Contract(
                ACCOUNT_ADDRESS,
                CONTRACT_ABI,
                signer
            ); 
            const tx = await contract.enterLottery({
                value: utils.parseEther("0.01")
            }

            ); 
            setLoading(true); 
            await tx.wait()
            setLoading(false);

        }catch(e) { 
            console.error(e); 
        }
    }



    const returnLotteryState = async() => { 
        try {
            const signer = await getProviderOrSigner(true);
            const contract = new Contract(
                ACCOUNT_ADDRESS,
                CONTRACT_ABI,
                signer
            ); 
            const tx = await contract.getLotteryState(); 
            setLoading(true); 
            setLotteryState(tx);
            setLoading(false);
            console.log(lotteryState)

        }catch(e) { 
            console.error(e); 
        }
    }


    const returnLatestWinner = async() => { 
        try {
            const signer = await getProviderOrSigner(true); 
            const contract = new Contract(
                ACCOUNT_ADDRESS,
                CONTRACT_ABI,
                signer
            ); 

            const tx = await contract.getRecentWinner();
            setLoading(true);
            setWinner(splitString(tx)); 
            setLoading(false);
            return winner;

        }catch(e) { 
            console.error(e)
        }

    }





    return ( 
        <div className = {styles.sectionHeader}>
            <div className = "w-7/12 h-96 bg-slate-600 flex justify-center items-center rounded-md flex-col gap-5  " > 
                    <h1>Connected Address {accountAddress}</h1>
                    <h1></h1>
                    <h3>Number Of Players {players}</h3>
                    <h3>Winner Of Lottery {winner}</h3>
            </div>
            
            <div className = "max-h-40 w-7/12 flex py-12 px-5 justify-between items-end border-b-2 border-black">
                <button onClick={joinLottery} className = "bg-gray-700 p-3 rounded-md text-white " > Join Lottery</button>
                <button  className = "bg-gray-700 p-3 rounded-md text-white " > Leave Lottery</button>
            </div>

        </div> 

    )

};

export default Heading; 