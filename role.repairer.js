const { targetedAt } = require("./util.creep");

const getAction = (creep) => {
    //no structures? we aren't needed!
    if (!creep.room.find(FIND_MY_STRUCTURES).length) {
        return "suicide";
    }

    //anything to repair (below 50% health)?
    if (
        creep.room.find(FIND_STRUCTURES, {
            filter: (structure) =>
                structure.hits < structure.hitsMax * 0.5 &&
                structure.structureType != STRUCTURE_WALL &&
                targetedAt(structure).length == 0,
        }).length
    ) {
        return "repair";
    }

    //anything to build?
    if (creep.room.find(FIND_MY_CONSTRUCTION_SITES).length) {
        return "build";
    }

    //transfer any energy we are carrying
    if (creep.store[RESOURCE_ENERGY] > 0) {
        return "transfer";
    }

    //otherwise do some harvesting
    return "harvest";
};

const minRequired = (room, structures = room.find(FIND_MY_STRUCTURES)) =>
    Math.ceil(structures.length / 10);

module.exports = {
    role: "repairer",
    getAction,
    minRequired,
    blueprint: [MOVE, CARRY, WORK],
};
