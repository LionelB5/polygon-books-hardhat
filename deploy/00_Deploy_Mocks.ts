import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const deployMocks: DeployFunction = async function (
  hre: HardhatRuntimeEnvironment
) {
  const { deployments, getNamedAccounts, getChainId } = hre;
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = await getChainId();

  // If this is to the local chain
  if (chainId === "31337") {
    log("Local network detected - Deploying mocks");

    // Deploy LINK token to our local network
    const LinkToken = await deploy("LinkToken", {
      from: deployer,
      log: true,
    });

    // Deploy a mock VRF Coordinator to our local network
    await deploy("VRFCoordinatorMock", {
      from: deployer,
      log: true,
      args: [LinkToken.address],
    });

    log("Mocks deployed");
  }
};
export default deployMocks;
deployMocks.tags = ["all", "mocks"];
