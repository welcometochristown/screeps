const { closestEnergyStorage } = require("util.geography");
const { spawnQueue } = require("creep.manage");

const withdraw = (creep, resource = RESOURCE_ENERGY) => {
    //withdrawal complete, ready for new action
    if (creep.store.getFreeCapacity(resource) == 0) {
        creep.memory.action = undefined;
        creep.memory.target = undefined;
        return;
    }

    var isPendingSpawns = !!spawnQueue(creep.room).length;

    //if there is nothing in the spawn build queue
    if (!isPendingSpawns) {
        //find the closeset {resource} storage location
        creep.memory.target = closestEnergyStorage(creep);

        //if we found one, then move to it and withdraw
        if (creep.memory.target) {
            //dont allow withdrawal while attempting to spawn new creeps, harvest its own energy
            if (
                creep.withdraw(creep.memory.target, resource) ==
                ERR_NOT_IN_RANGE
            ) {
                creep.moveTo(creep.memory.target);
            }
            return;
        }
    }

    //otherwise go harvesting itself
    creep.memory.action = "harvest";
    creep.memory.target = undefined;
    return;
};

module.exports = {
    run: withdraw,
    action: "withdraw",
};
