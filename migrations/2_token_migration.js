const AirDropToken = artifacts.require("AirDropToken");

module.exports = function(deployer) {
  deployer.deploy(
    AirDropToken,
    "0x90fe0b775d3ca52008fd9a8d443501c021ce40d7fdd51c7d43a5a0abcee73391"
  );
};
