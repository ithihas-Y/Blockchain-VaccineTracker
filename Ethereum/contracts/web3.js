import Web3 from 'web3';

let web3;

if(typeof window !== 'undefined' && typeof window.web3 !== 'undefined'){
    web3 = new Web3(window.web3.currentProvider);
}else{
    const provider = new Web3.providers.
    HttpProvider("https://kovan.infura.io/v3/9f3d8186709a421682de36b256019655");

    web3 = new Web3(provider);
}

export default web3;