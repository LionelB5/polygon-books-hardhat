// SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;

import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721URIStorageUpgradeable.sol";
import "./chainlink/VRFConsumerBaseUpgradeable.sol";

contract CryptoBooks is
    Initializable,
    ERC721URIStorageUpgradeable,
    VRFConsumerBaseUpgradeable
{
    bytes32 internal keyHash;
    uint256 internal fee;

    address private vrfCoordinator;

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

    event RequestedRandomness(bytes32 requestId);

    function initialize(
        address _VRFCoordinator,
        address _linkToken,
        bytes32 _keyHash,
        uint256 _chainlinkFee
    ) public initializer {
        __VRFConsumerBase_init(_VRFCoordinator, _linkToken);
        __ERC721_init_unchained("CryptoBooks", "BOOK");
        vrfCoordinator = _VRFCoordinator;
        keyHash = _keyHash;
        fee = _chainlinkFee;
    }

    function requestNewRandomBook(string memory name, string memory author)
        public
        returns (bytes32)
    {
        bytes32 requestId = requestRandomness(keyHash, fee);
        emit RequestedRandomness(requestId);
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
        require(
            _isApprovedOrOwner(_msgSender(), tokenId),
            "Not approved or owner"
        );
        _setTokenURI(tokenId, _tokenURI);
    }
}
