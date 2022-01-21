import * as dotenv from "dotenv";

import { HardhatUserConfig, task } from "hardhat/config";
import "@appliedblockchain/chainlink-plugins-fund-link";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-waffle";
import "@typechain/hardhat";
import "hardhat-deploy";
import "hardhat-gas-reporter";
import "solidity-coverage";

dotenv.config();

task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      {
        version: "0.8.7",
      },
      {
        version: "0.6.6",
      },
      {
        version: "0.4.24",
      },
    ],
  },
  networks: {
    polygon_testnet: {
      url: "https://rpc-mumbai.maticvigil.com",
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: "AUD",
  },
  etherscan: {
    apiKey: { polygonMumbai: process.env.POLYGON_SCAN_API_KEY },
  },
  namedAccounts: {
    deployer: {
      default: 0,
      1: 0,
    },
  },
};

export default config;
