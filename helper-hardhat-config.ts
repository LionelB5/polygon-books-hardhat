export interface networkConfigItem {
  name: string;
  chainlinkFee: string;
  keyHash: string;
  linkToken?: string;
  vrfCoordinator?: string;
}

export interface networkConfigInfo {
  [key: string]: networkConfigItem;
}

export const networkConfig: networkConfigInfo = {
  default: {
    name: "hardhat",
    chainlinkFee: "100000000000000000",
    keyHash:
      "0x6c3699283bda56ad74f6b855546325b68d482e983852a7a82979cc4807b641f4",
  },
  31337: {
    name: "localhost",
    chainlinkFee: "100000000000000000",
    keyHash:
      "0x6c3699283bda56ad74f6b855546325b68d482e983852a7a82979cc4807b641f4",
  },
  80001: {
    name: "polygon_testnet",
    linkToken: "0x326C977E6efc84E512bB9C30f76E30c160eD06FB",
    keyHash:
      "0x6e75b569a01ef56d18cab6a8e71e6600d6ce853834d4a5748b720d06f878b3a4",
    vrfCoordinator: "0x8C7382F9D8f56b33781fE506E897a4F1e2d17255",
    chainlinkFee: "100000000000000000",
  },
};

export const developmentChains = ["hardhat", "localhost"];
