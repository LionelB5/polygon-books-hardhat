// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBase.sol";

contract CryptoBooks is ERC721URIStorage, VRFConsumerBase {
    bytes32 internal keyHash;
    uint256 internal fee;

    address public vrfCoordinator;
    uint256 public randomResult;

    struct Book {
        string author;
        string name;
        uint256 pages;
    }

    Book[] public books;

    mapping(bytes32 => string) public requestToBookName;
    mapping(bytes32 => string) public requestToAuthorName;
    mapping(bytes32 => address) public requestToSender;
    mapping(bytes32 => uint256) public requestToTokenId;

    constructor(
        address _VRFCoordinator,
        address _LinkToken,
        bytes32 _keyHash
    ) VRFConsumerBase(_VRFCoordinator, _LinkToken) ERC721("BookNFT", "BOOK") {
        vrfCoordinator = _VRFCoordinator;
        keyHash = _keyHash;
        fee = 0.1 * 10**18; //0.1 LINK
    }

    function requestNewRandomBook(string memory name, string memory author)
        public
        returns (bytes32)
    {
        bytes32 requestId = requestRandomness(keyHash, fee);
        requestToBookName[requestId] = name;
        requestToAuthorName[requestId] = author;
        requestToSender[requestId] = msg.sender;
        return requestId;
    }

    function fulfillRandomness(bytes32 requestId, uint256 randomNumber)
        internal
        override
    {
        uint256 newId = books.length;
        uint256 pages = (randomNumber % 100);

        books.push(
            Book(
                requestToAuthorName[requestId],
                requestToBookName[requestId],
                pages
            )
        );
        _safeMint(requestToSender[requestId], newId);
    }

    function setTokenURI(uint256 tokenId, string memory _tokenURI) public {
        require(_isApprovedOrOwner(_msgSender(), tokenId), "Not approved or owner");
        _setTokenURI(tokenId, _tokenURI);
    }
}
