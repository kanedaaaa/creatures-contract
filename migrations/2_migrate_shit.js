const Creatures = artifacts.require("Creatures");
const Croakens = artifacts.require("Croakens");

// migrate smart contracts
module.exports = deployer => {
    deployer.deploy(Croakens).then(res => {
        deployer.deploy(Creatures, res.address);
    })
};
