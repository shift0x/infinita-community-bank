require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.8.28"
      }
    ]
  },
  networks: {
    base_sepolia: {
      url: "https://sepolia.base.org",
      accounts: [ vars.get("SMART_CONTRACT_DEPLOYER") ],
    }
  }
};