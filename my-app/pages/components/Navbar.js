 

import React from 'react';
import { render } from 'react-dom';



const Navbar = ({Connect, isConnected,accountAddress }) => { 
const renderButton = () => { 

    if(!isConnected) { 
            return <button onClick={Connect} className = "bg-gray-700 p-3 rounded-md text-white ">Connect Wallet</button>
        
    }if(isConnected) { 
        return ( 
        <div className = "bg-gray-700 p-3 rounded-md text-white ">{accountAddress}</div>
        )
    }
}




    return ( 
        <nav className = "max-h-40 max-w-full flex py-12 px-5 justify-between items-end border-b-2 border-black ">
            <h1 className = "text-3xl">Decentralized Lottery</h1>
                {renderButton()}
                    </nav>

    )


};

export default Navbar;