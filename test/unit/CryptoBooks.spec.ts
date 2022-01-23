import { LogLevel } from "@ethersproject/logger";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { deployments, ethers, run } from "hardhat";
import { Deployment } from "hardhat-deploy/dist/types";
import { CryptoBooks, LinkToken } from "../../typechain-types";

describe("CryptoBooks", () => {
  let LinkToken: Deployment;
  let VRFCoordinatorMock: Deployment;
  let cryptoBooks: CryptoBooks;
  let linkToken: LinkToken;
  let signers: SignerWithAddress[];
  let defaultSigner: SignerWithAddress;

  beforeEach(async () => {
    await deployments.fixture(["books", "mocks"]);
    const BookDeployment = await deployments.get("CryptoBooks");
    LinkToken = await deployments.get("LinkToken");
    VRFCoordinatorMock = await deployments.get("VRFCoordinatorMock");
    signers = await ethers.getSigners();
    defaultSigner = signers[0];
    cryptoBooks = await ethers.getContractAt(
      "CryptoBooks",
      BookDeployment.address,
      defaultSigner
    );

    // modify the ethers log level to suppress `Duplicate definition` warnings
    // https://github.com/ethers-io/ethers.js/issues/905
    ethers.utils.Logger.setLogLevel(LogLevel.ERROR);
    linkToken = await ethers.getContractAt(
      "LinkToken",
      LinkToken.address,
      defaultSigner
    );
    ethers.utils.Logger.setLogLevel(LogLevel.WARNING);
    await linkToken.transfer(cryptoBooks.address, "100000000000000000");
  });

  describe("requestNewRandomBook", () => {
    it("should update the `requestToBookName` mapping with the given book name", async () => {
      const transaction = await cryptoBooks.requestNewRandomBook(
        "fake-book-name",
        "fake-author"
      );
      const receipt = await transaction.wait();
      const requestId = receipt.events![3].args![0];
      const bookName = await cryptoBooks.requestToBookName(requestId);
      expect(bookName).to.equal("fake-book-name");
    });

    it("should update the `requestToAuthorName` mapping with the given author name", async () => {
      const transaction = await cryptoBooks.requestNewRandomBook(
        "fake-book-name",
        "fake-author"
      );
      const receipt = await transaction.wait();
      const requestId = receipt.events![3].args![0];
      const authorName = await cryptoBooks.requestToAuthorName(requestId);
      expect(authorName).to.equal("fake-author");
    });

    it("should update the `requestToSender` mapping with the sending address", async () => {
      const transaction = await cryptoBooks.requestNewRandomBook(
        "fake-book-name",
        "fake-author"
      );
      const receipt = await transaction.wait();
      const requestId = receipt.events![3].args![0];
      const senderAddress = await cryptoBooks.requestToSender(requestId);
      expect(senderAddress).to.equal(defaultSigner.address);
    });

    // TODO: Test `fulfillRandomness` & `setTokenURI`
  });
});
