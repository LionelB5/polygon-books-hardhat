import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { Deployment } from "hardhat-deploy/dist/types";
import { networkConfig } from "../helper-hardhat-config";

const deployCryptoBooks: DeployFunction = async function (
  hre: HardhatRuntimeEnvironment
) {
  const { deployments, getChainId, getNamedAccounts } = hre;
  const { deployer, proxyOwner } = await getNamedAccounts();
  const { get, deploy } = deployments;
  const chainId = await getChainId();

  let linkTokenAddress: string | undefined;
  let vrfCoordinatorAddress: string | undefined;
  let LinkToken: Deployment;
  let VRFCoordinatorMock: Deployment;

  if (chainId === "31337") {
    LinkToken = await get("LinkToken");
    VRFCoordinatorMock = await get("VRFCoordinatorMock");
    linkTokenAddress = LinkToken.address;
    vrfCoordinatorAddress = VRFCoordinatorMock.address;
  } else {
    linkTokenAddress = networkConfig[chainId].linkToken;
    vrfCoordinatorAddress = networkConfig[chainId].vrfCoordinator;
  }

  const keyHash: string = networkConfig[chainId].keyHash;
  const chainlinkFee: string = networkConfig[chainId].chainlinkFee;
  await deploy("CryptoBooks", {
    from: deployer,
    log: true,
    proxy: {
      proxyContract: "TransparentUpgradeableProxy",
      viaAdminContract: "ProxyAdmin",
      owner: proxyOwner,
      execute: {
        init: {
          methodName: "initialize",
          args: [
            vrfCoordinatorAddress,
            linkTokenAddress,
            keyHash,
            chainlinkFee,
          ],
        },
      },
    },
  });
};
export default deployCryptoBooks;
deployCryptoBooks.tags = ["all", "books"];
