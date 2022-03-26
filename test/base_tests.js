const Creatures = artifacts.require("Creatures");
const Croakens = artifacts.require("Croakens");
const Swampies = artifacts.require("Swampverse");
const truffleAssert = require('truffle-assertions');
const Web3 = require("web3");

/**
 * accounts[0] - admin
 * accounts[1] - user
 * accounts[3] - burn address 
 */

contract("Creatures - Happy/Sad testing", async (accounts) => {
  let creatures;
  let croakens;
  let swampies;
  let web3;

  beforeEach(async () => {
    croakens = await Croakens.new();
    swampies = await Swampies.new();
    creatures = await Creatures.new(croakens.address, swampies.address);

    web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));

    await swampies.setApprovalForAll(creatures.address, true, { from: accounts[1] });
    await creatures.toggleMinting(true, { from: accounts[0] });
    await creatures.changeBurnAddress(2, accounts[3], { from: accounts[0] });
    await croakens.approve(creatures.address, web3.utils.toWei("450", "ether"), { from: accounts[1] });
  });

  it("should mint tokens", async () => {
    await croakens.mint(accounts[1], web3.utils.toWei("1000", "ether"));
    await swampies.mint(10, accounts[1]);

    await croakens.balanceOf(accounts[1]).then((res) => {
      userBalanceBefore = web3.utils.fromWei(res.toString(), "ether");
    });

    await swampies.balanceOf(accounts[1]).then((res) => {
      userSwampBalanceBefore = res.toString();
    });

    await creatures.mintCreature([0, 1], { from: accounts[1] });

    await croakens.balanceOf(accounts[1]).then((res) => {
      userBalanceAfter = web3.utils.fromWei(res.toString(), "ether");
    });

    await swampies.balanceOf(accounts[1]).then((res) => {
      userSwampBalanceAfter = res.toString();
    });

    await creatures.ownerOf(0).then((res) => {
      owner = res;
    });

    assert.equal(userBalanceAfter, userBalanceBefore - 450);
    assert.equal(userSwampBalanceAfter, userSwampBalanceBefore - 2);
    assert.equal(owner, accounts[1]);
  });

  it("should revert if user sends more nfts than required", async () => {
    await croakens.mint(accounts[1], web3.utils.toWei("1000", "ether"));
    await swampies.mint(10, accounts[1]);

    await truffleAssert.fails(
      creatures.mintCreature([0, 1, 2], { from: accounts[1] }),
      truffleAssert.ErrorType.REVERT,
      "Creatures.mintCreature: WRONG_IDS_LENGTH"
    );
  });

  it("should revert if user sends tokens they do not own", async () => {
    await croakens.mint(accounts[1], web3.utils.toWei("1000", "ether"));

    await truffleAssert.fails(
      creatures.mintCreature([0, 1], { from: accounts[1] }),
      truffleAssert.ErrorType.REVERT
    );
  })

  it("should revert if user has insufficient croakens", async () => {
    await swampies.mint(10, accounts[1]);

    await truffleAssert.fails(
      creatures.mintCreature([0, 1], { from: accounts[1] }),
      truffleAssert.ErrorType.REVERT
    );
  });

  it("should revert if user tries to mint when minting isn't allowed", async () => {
    await creatures.toggleMinting(false, { from: accounts[0] });
    await croakens.mint(accounts[1], web3.utils.toWei("1000", "ether"));
    await swampies.mint(10, accounts[1]);

    await truffleAssert.fails(
      creatures.mintCreature([0, 1], { from: accounts[1] }),
      truffleAssert.ErrorType.REVERT,
      "Creatures.mintCreature: MINTING_NOT_ALLOWED"
    );
  });

  it("should revert if user mints more than total supply", async () => {
    await croakens.mint(accounts[1], web3.utils.toWei("1000", "ether"));
    await swampies.mint(10, accounts[1]);

    //lets make max supply 1
    await creatures.setUintInfo(1, 1, { from: accounts[0] });

    //supply is minted
    await creatures.mintCreature([0, 1], { from: accounts[1] });

    await truffleAssert.fails(
      creatures.mintCreature([2, 3], { from: accounts[1] }),
      truffleAssert.ErrorType.REVERT,
      "Creatures.mintCreature: TOKEN_LIMIT_ERROR"
    );
  })
});
