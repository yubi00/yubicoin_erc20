// Allows us to use ES6 in our migrations and tests.
require('babel-register')
var HDWalletProvider = require("truffle-hdwallet-provider");
var mnemonic = "position train actor extend actual version help nest clean sunset sausage expect";
var infura_apikey = 'XpZDiORHfS2PvTTOTFQk';
const Web3 = require("web3");
const web3 = new Web3();

module.exports = {
  networks: {
    development: {
      host: "localhost",
      port: 8545,
      network_id: "*" // Match any network id
    },
    ropsten: {
      provider: new HDWalletProvider(mnemonic, "https://ropsten.infura.io/"+infura_apikey),
      network_id: 3,
      gas: 4700000,
      gasPrice: web3.toWei("20", "gwei"),
    }
  }
};