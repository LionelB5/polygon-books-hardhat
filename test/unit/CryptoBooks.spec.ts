import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { deployments, ethers, run } from "hardhat";
import { Deployment } from "hardhat-deploy/dist/types";
import { CryptoBooks } from "../../typechain-types";

describe("CryptoBooks", () => {
  let LinkToken: Deployment;
  let VRFCoordinatorMock: Deployment;
  let cryptoBooks: CryptoBooks;
  let signers: SignerWithAddress[];
  let defaultSigner: SignerWithAddress;

  beforeEach(async () => {
    await deployments.fixture(["books", "mocks"]);
    const BookDeployment = await deployments.get("CryptoBooks");
    LinkToken = await deployments.get("LinkToken");
    VRFCoordinatorMock = await deployments.get("VRFCoordinatorMock");
    signers = await ethers.getSigners();
    defaultSigner = signers[0];
    // @ts-ignore
    cryptoBooks = await ethers.getContractAt(
      "CryptoBooks",
      BookDeployment.address,
      defaultSigner
    );
    // TODO: Find a better way to fund link that doesn't rely on a command or spam the logs
    await run("fund-link", {
      contract: cryptoBooks.address,
      linkaddress: LinkToken.address,
      fundAmount: 1,
    });
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
      console.log("default signer address: " + defaultSigner.getAddress());
      expect(senderAddress).to.equal(defaultSigner.address);
    });

    // TODO: Test `fulfillRandomness` & `setTokenURI`
  });
});
