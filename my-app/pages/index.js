import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import React, {useState, useEffect, useRef} from 'react';

//components 
import Navbar from './components/Navbar'
import Heading from './components/Heading';


//get are web3 dependencies 
import {ethers, providers, Contract} from 'ethers'
import Web3modal from 'web3modal';
//import contract stuff
export default function Home() {
  const [isConnected, setIsConnected] = useState(false); 
  const [accountAddress, setAccountAddress] = useState(""); 
  const [loading, setLoading] = useState(false); 
  //get a hold of web3modal 
  const web3modal = useRef(); 
  //let set the web3modal to network onload everytime 
  useEffect(() => { 
    web3modal.current = new Web3modal({
      network: "rinkeby", 
      providerOptions: {},
      disableInjectedProvider: false
    });


  })
  
  //This functino splits the string 
  const splitString = string => { 
    let result1 = string.substring(0,5) //gets the first 5 charactesr of string 
    let result2 = string.substring(38, string.lenght) // lets the last 5? dendingon the length of array 
    let finalResult = result1 + "..." + result2 //concact them together 
    return finalResult;
  }

  //get provider or Signer 
  const getProviderOrSigner = async(needSigner = false) => { 
    const provider = await web3modal.current.connect()
    const web3provider = new providers.Web3Provider(provider)

    const signer =  web3provider.getSigner();
    const address = await  signer.getAddress();
    const substringAddress = splitString(address);
    setAccountAddress(substringAddress);

    //check if connected currenlty to the right chainID
    //set it in brackets because chainID is an object 
    const {chainId} = await web3provider.getNetwork();
    if(chainId !== 4) { 
      window.alert("You are on the wrong network, switch to rinkeby")
    }

    if(needSigner) { 
      const signer = web3provider.getSigner(); 
      return signer;
    }

    return web3provider;

  }

  //create a function that connects us 
console.log(isConnected)

  const Connect = async() => { 
    try { 
      await getProviderOrSigner();
      setIsConnected(true); 
    }catch(e) { 
      console.error(e)
    }


  }








  return (
    <div className={styles.container}>
     <Navbar
      Connect = {Connect}
      isConnected = {isConnected}
      accountAddress = {accountAddress}
     />
    <Heading
    getProviderOrSigner = {getProviderOrSigner}
    accountAddress = {accountAddress}
    splitString = {splitString}
    
    />
    

    </div>  
  )
}
