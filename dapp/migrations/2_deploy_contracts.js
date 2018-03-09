var YubiCoin = artifacts.require("./YubiCoin.sol");

module.exports = function(deployer) {
  deployer.deploy(YubiCoin);
};
