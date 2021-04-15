const HDWalletProvider = require("@truffle/hdwallet-provider");
const Web3 = require('web3');
const compiledContract = require('../Ethereum/build/contract.json');

const Abi = compiledContract['Contract.sol'].VaccineTracker.abi;
const BC = compiledContract['Contract.sol'].VaccineTracker.evm.bytecode.object;

let provider = new HDWalletProvider({
    mnemonic: {
      phrase: "start emerge scale divert hedgehog mean mountain mosquito verb soul seed pill"
    },
    providerOrUrl: "https://kovan.infura.io/v3/9f3d8186709a421682de36b256019655"
  },
  );


const web3 = new Web3(provider);

const deploy = async () =>{
    try {

        let block = await web3.eth.getBlock("latest");
        console.log("gasLimit: " + block.gasLimit);

        let acc = await web3.eth.getAccounts(function (error, result) {
        
        });
        console.log('accounts = ' + acc);

        let bal = await web3.eth.getBalance(acc[0],function(error, result) {
            
        });

        console.log(bal);

        const result = await new web3.eth.Contract(Abi)
        .deploy({data: '0x' + BC})
        .send({from: acc[0],gas: '10000000'});

    console.log("deployed to " + result.options.address);
        
    } catch (error) {
        console.log(error);
    }
};

deploy();

provider.engine.stop();
