import { ethers } from "hardhat";

const MUMBAI_VRF_COORDINATOR = "0x8C7382F9D8f56b33781fE506E897a4F1e2d17255";
const MUMBAI_LINKTOKEN = "0x326C977E6efc84E512bB9C30f76E30c160eD06FB";
const MUMBAI_KEYHASH =
  "0x6e75b569a01ef56d18cab6a8e71e6600d6ce853834d4a5748b720d06f878b3a4";

async function main() {
  const CryptoBooks = await ethers.getContractFactory("CryptoBooks");
  const cryptoBooks = await CryptoBooks.deploy(
    MUMBAI_VRF_COORDINATOR,
    MUMBAI_LINKTOKEN,
    MUMBAI_KEYHASH
  );

  await cryptoBooks.deployed();

  console.log("CryptoBooks deployed to:", cryptoBooks.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
