const { closest } = require("util.geography");
const { isWorker } = require("util.creep");

const repair = (creep, room) => {
    if (!isWorker(creep)) {
        creep.memory.target = undefined;
        creep.memory.action = undefined;
        return;
    }

    if (creep.carry.energy == 0) {
        creep.memory.action = "withdraw";
        creep.memory.target = undefined;
        return;
    }

    const targets = room.find(FIND_STRUCTURES, {
        filter: (object) =>
            object.hits < object.hitsMax &&
            object.structureType != STRUCTURE_WALL,
    });

    creep.memory.target = closest(creep, targets);

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
