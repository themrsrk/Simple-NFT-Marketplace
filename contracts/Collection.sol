//Contract based on [https://docs.openzeppelin.com/contracts/3.x/erc721](https://docs.openzeppelin.com/contracts/3.x/erc721)
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract Collection is ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    Counters.Counter private _totalMinted; //First we setup a new Counter (_totalMinted) to keep track of the total number of NFTs that we have minted.
    mapping(address => uint8) private mintedAddress; //Whenever an address mints an NFT, the value of the number of NFTs held by that address increases in the mapping - “mintedAddress”
    mapping(string => uint8) private URIMapping;
    uint256 public PRICE_PER_TOKEN = 0.01 ether;
    uint256 public LIMIT_PER_ADDRESS = 2; //To set the minting limit per person we do a similar thing as the minting price.

    uint256 public MAX_SUPPLY = 5; //We make a MAX_SUPPLY variable and initially set it to a max supply of 5, which the owner can change later on.

    constructor() ERC721("Collection", "NFT") {}

    function setPrice(uint256 price) external onlyOwner {
        PRICE_PER_TOKEN = price;
    }

    function setLimit(uint256 limit) external onlyOwner {
        LIMIT_PER_ADDRESS = limit;
    }

    function setMaxSupply(uint256 max_supply) external onlyOwner {
        MAX_SUPPLY = max_supply;
    }

    function mintNFT(string memory tokenURI)
        external
        payable
        returns (uint256)
    {
        require(PRICE_PER_TOKEN <= msg.value, "Ether paid is incorrect"); //If the money sent to the contract is less than 0.01 eth, then the transaction is reverted.
        require(
            mintedAddress[msg.sender] < LIMIT_PER_ADDRESS,
            "You have exceeded minting limit"
        ); //we use a require statement to enforce that the number of NFTs minted by that address is less than the limit set by the owner.
        require(
            _totalMinted.current() + 1 <= MAX_SUPPLY,
            "You have exceeded Max Supply"
        ); //Before minting any NFT, we check if minting that NFT would make the total supply go above the MAX_SUPPLY threshold, if yes then we revert the transaction
        require(URIMapping[tokenURI] == 0, "This NFT has already been minted"); //We are also adding a feature to our smart contract, which will not allow somebody to mint the same NFT again.

        URIMapping[tokenURI] += 1;
        mintedAddress[msg.sender] += 1;
        _tokenIds.increment();
        _totalMinted.increment(); //If the total supply is under the MAX_SUPPLY, then we increment the total supply by one and mint the NFT.

        uint256 newItemId = _tokenIds.current();
        _mint(msg.sender, newItemId);
        _setTokenURI(newItemId, tokenURI);

        return newItemId;
    }

    function withdrawMoney() external onlyOwner {
        //We use the onlyOwner modifier to make sure that only the person who owns the contract can take out money from it.
        address payable to = payable(msg.sender); //We then create a payable address called “to” and set its value equal to the person who is sending the function call ( Which can only by the owner or the transaction will be reverted)
        to.transfer(address(this).balance); //We use the transfer method of the address variable to transfer all of the smart contract’s balance to the owner’s public address.
    }
}
