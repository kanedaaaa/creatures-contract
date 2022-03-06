pragma solidity ^0.8.11;

import "erc721a/contracts/ERC721A.sol";
import "erc721a/contracts/extensions/ERC721ABurnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

import "./mocks/interfaces/ICroakens.sol";
import "./mocks/interfaces/ISwampverse.sol";

contract Creatures is ERC721A, ERC721ABurnable, Ownable {
    using Strings for uint256;

    uint256 MAX_SUPPLY = 2400;
    uint256 ERC20_BURN_AMOUNT = 450 * (10**18);
    uint256 ERC721_BURN_AMOUNT = 2;

    string public BEGINNING_URI = "";
    string public ENDING_URI = "";

    address public blackHole = 0x000000000000000000000000000000000000dEaD;

    ICroakens public croakens;
    ISwampverse public swampverse;

    uint256 internal count;

    constructor(ICroakens _croakens, ISwampverse _swampverse)
        ERC721A("Creatures", "Creatures")
    {
        croakens = _croakens;
        swampverse = _swampverse;
    }

    /**
        @notice mint a creature in exchange of 2 swampverse token
        and 450 croakens burn

        @param _ids => array of swampverse ids to be burned

        @dev it might be smart to add some security checks, such
        as: safeTrasnfer should return positive success, but im
        pretty sure if it fails, function will fail as well, which
        is unlikely to happen at first place.
     */
    function mintCreature(uint256[] memory _ids) public {
        require(count <= MAX_SUPPLY, "Creatures.mintCreature: TOKEN_LIMIT_ERROR");
        require(_ids.length == ERC721_BURN_AMOUNT, "Creatures.mintCreature: WRONG_IDS_LENGTH");

        croakens.burn(msg.sender, ERC20_BURN_AMOUNT);

        for (uint256 x = 0; x < _ids.length; x++) {
            swampverse.safeTransferFrom(msg.sender, blackHole, _ids[x]);
        }
        _safeMint(msg.sender, 1);
        count += 1;
    }

    /**
        @notice only way to properly burn nft

        @param _token_id => id of creature to be burned

        @dev i need to test this if it works, since its ported
        from ERC721A optional extension
     */
    function burnToken(uint256 _token_id) public {
        burn(_token_id);
    }

    /**
        @param _mode: 
        1 - replace beinning of URI
        2 (or anything else) - replce ending of URI

        @param _new_uri: corresponding value
     */
    function setURI(uint256 _mode, string memory _new_uri) public onlyOwner {
        if (_mode == 1) BEGINNING_URI = _new_uri;
        else ENDING_URI = _new_uri;
    }

    /**
        @param _mode:
        1 - change max_supply 
        2 - change Croakens burn amount
        3 (or anything else) - change swampverse burn amount

        @param _value: corresponding value
     */
    function setUintInfo(uint256 _mode, uint256 _value) public onlyOwner {
        if (_mode == 1) MAX_SUPPLY = _value;
        else if (_mode == 2) ERC20_BURN_AMOUNT = _value * (10**18);
        else ERC721_BURN_AMOUNT = _value;
    }

    /**
        @notice change burn address

        @param _value => new burn address

        @dev can't set 0x0 due to previous contract implementation
        restrictions from openzeppelin ERC721 contract.
     */
    function changeBurnAddress(address _value) public onlyOwner {
        require(
            _value != address(0),
            "Creatures.changeBurnAddress: zero_address_transfer_is_restricted"
        );
        blackHole = _value;
    }

    function tokenURI(uint256 tokenId)
        public
        view
        virtual
        override
        returns (string memory)
    {
        return
            string(
                abi.encodePacked(BEGINNING_URI, tokenId.toString(), ENDING_URI)
            );
    }
}
