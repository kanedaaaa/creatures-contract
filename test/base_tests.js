const Creatures = artifacts.require("Creatures");
const Croakens = artifacts.require("Croakens");
const Swampies = artifacts.require("Swampverse");
// const truffleAssert = require('truffle-assertions');
const Web3 = require("web3");

contract("Creatures - Base Test", async (accounts) => {
  let creatures;
  let croakens;
  let swampies;
  let web3;

  beforeEach(async () => {
    croakens = await Croakens.new();
		swampies = await Swampies.new();
    creatures = await Creatures.new(croakens.address, swampies.address);

    web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));

    await croakens.mint(web3.utils.toWei("1000", "ether"), {from: accounts[1]});
    await croakens.approve(
      creatures.address,
      web3.utils.toWei("1000", "ether"),
      { from: accounts[1] }
    );
    await swampies.mint(10, { from: accounts[1] });
    await swampies.setApprovalForAll(creatures.address, true, { from: accounts[1] });
  });

  it("Should mint creature according to rules", async () => {
    await croakens.balanceOf(accounts[1]).then(res => {
      userBalanceBefore = web3.utils.fromWei(res.toString(), "ether");
    })

    await swampies.balanceOf(accounts[1]).then(res => {
      userSwampBalanceBefore = res.toString();
    })

    await creatures.mintCreature([0,1,2], { from: accounts[1] });

    await croakens.balanceOf(accounts[1]).then(res => {
      userBalanceAfter = web3.utils.fromWei(res.toString(), "ether");
    });

    await swampies.balanceOf(accounts[1]).then(res => {
      userSwampBalanceAfter = res.toString();
    });

    await creatures.ownerOf(0).then(res => {
      owner = res;
      });

    assert.equal(userBalanceAfter, userBalanceBefore - 450);
    assert.equal(userSwampBalanceAfter, userSwampBalanceBefore - 3);
    assert.equal(owner, accounts[1]);
  })

});
