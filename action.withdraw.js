const { closestEnergyStorage } = require("util.geography");
const { isWorker } = require("util.creep");
const { energyStored } = require("util.resource");

const withdraw = (creep, resource = RESOURCE_ENERGY) => {
    //withdrawal complete, ready for new action
    if (creep.store.getFreeCapacity(resource) == 0) {
        creep.memory.action = undefined;
        creep.memory.target = undefined;
        return;
    }

    //if there is nothing in the spawn build queue
    var target = undefined;

    if (creep.memory.target) {
        //get the target
        target = Game.getObjectById(creep.memory.target.id);

        //check whether the target has any energy
        if (!target || target.store[resource] == 0) target = undefined;
    }

    if (!target) {
        //find the closeset {resource} storage location
        target = closestEnergyStorage(creep);
    }

    //if we found one, then move to it and withdraw
    if (target) {
        const storedEnergy = energyStored(creep.room);
        var amount = 0; //as much as possible

        if (creep.memory.role == "upgrader") {
            amount = Math.min(
                creep.store.getFreeCapacity(RESOURCE_ENERGY),
                storedEnergy * 0.1
            ); // only 10% max for upgrading

            amount = Math.min(
                amount,
                target.store.getUsedCapacity(RESOURCE_ENERGY)
            );
        }

        const result = creep.withdraw(target, resource, amount);

        if (result == ERR_NOT_IN_RANGE) {
            creep.moveTo(target);
        } else if (result != OK) {
            console.log(
                `${creep.memory.role} withdraw error : ${result} from ${target.id}, amount ${amount}`
            );
        }
        return;
    }

    //otherwise go harvesting itself
    creep.memory.action =
        creep.memory.role != isWorker(creep) ? "harvest" : undefined;
    creep.memory.target = undefined;
    return;
};

module.exports = {
    run: withdraw,
    action: "withdraw",
};
