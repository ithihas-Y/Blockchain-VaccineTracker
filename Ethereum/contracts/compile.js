const path = require('path');
const solc = require('solc');
const fs = require('fs-extra');

const buildPath = path.resolve(__dirname,'build');
fs.removeSync(buildPath);

const contract = path.resolve(__dirname,'contracts','Contract.sol');
const source = fs.readFileSync(contract,'utf-8');

var input = {
    language: 'Solidity',
    sources: {
        'Contract.sol' : {
            content: source
        }
    },
    settings: {
        outputSelection: {
            '*': {
                '*': [ '*' ]
            }
        }
    }
}; 

const output = JSON.parse(solc.compile(JSON.stringify(input)));


fs.ensureDirSync(buildPath);

fs.outputJSONSync(path.resolve(buildPath,'contract.json'),output.contracts);


