const Creatures = artifacts.require("Creatures");
const Croakens = artifacts.require("Croakens");
const Swampverse = artifacts.require("Swampverse");

module.exports = async (deployer) => {
  await deployer.deploy(Swampverse).then((res) => {
    swamp = res.address;
  });

  await deployer.deploy(Croakens).then(async (res) => {
    await deployer.deploy(Creatures, res.address, swamp);
  });
};
