const { closest } = require("./util.geography");
const { isWorker } = require("./util.creep");
const { targetedAt } = require("./util.creep");

const repair = (creep, room) => {
    if (!isWorker(creep)) {
        creep.memory.target = undefined;
        creep.memory.action = undefined;
        return;
    }

    if (creep.store[RESOURCE_ENERGY] == 0) {
        creep.memory.action = "withdraw";
        creep.memory.target = undefined;
        return;
    }

    if (creep.memory.target) {
        creep.memory.target = Game.getObjectById(creep.memory.target.id);
    }

    //if no target in memory, or the target is now fully repaired find another
    if (
        !creep.memory.target ||
        creep.memory.target.hits == creep.memory.target.hitsMax
    ) {
        const targets = room.find(FIND_STRUCTURES, {
            filter: (structure) =>
                structure.hits < structure.hitsMax &&
                structure.structureType != STRUCTURE_WALL &&
                targetedAt(structure).length == 0,
        });

        creep.memory.target = closest(creep, targets);
    }

    //try and find a target, move and repair it
    if (creep.memory.target) {
        if (creep.repair(creep.memory.target) == ERR_NOT_IN_RANGE) {
            creep.moveTo(creep.memory.target);
        }
        return;
    }

    //nothing to repair
    creep.memory.action = undefined;
    creep.memory.target = undefined;
};

module.exports = {
    run: repair,
    action: "repair",
};
