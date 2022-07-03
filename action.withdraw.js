const { closestEnergyStorage } = require("util.geography");
const { isWorker } = require("util.creep");
const { energyStored } = require("util.resource");

const withdraw = (creep, room, resource = RESOURCE_ENERGY) => {
    //withdrawal complete, ready for new action
    if (creep.store.getFreeCapacity(resource) == 0) {
        creep.memory.action = undefined;
        creep.memory.target = undefined;
        return;
    }

    if (!creep.memory.target || creep.memory.target.store[resource] == 0) {
        //find the closeset {resource} storage location
        creep.memory.target = closestEnergyStorage(creep);
    }

    //if we found one, then move to it and withdraw
    if (creep.memory.target) {
        let amount = 0; //as much as possible

        //limit withdrawal amount by role
        if (creep.memory.role == "upgrader") {
            const storedEnergy = energyStored(room);
            amount = Math.min(creep.store.getFreeCapacity(RESOURCE_ENERGY), storedEnergy * 0.1); // only 10% max for upgrading
            amount = Math.min(amount, creep.memory.target.store.getUsedCapacity(RESOURCE_ENERGY)); //make sure amount is available in store
        }

        if (creep.withdraw(creep.memory.target, resource, amount) == ERR_NOT_IN_RANGE) {
            creep.moveTo(creep.memory.target);
        }
        return;
    }

    //otherwise go harvesting to withdraw
    creep.memory.action = creep.memory.role != isWorker(creep) ? "harvest" : undefined;
    creep.memory.target = undefined;
    return;
};

module.exports = {
    run: withdraw,
    action: "withdraw",
};
