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
                (structure.hits < structure.hitsMax * 0.5 &&
                    targetedAt(structure).length == 0 &&
                    ![STRUCTURE_WALL, STRUCTURE_RAMPART].includes(structure.structureType)) ||
                structure.hits < 50000,
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

const getRequired = (room, structures = room.find(FIND_MY_STRUCTURES)) => Math.ceil(structures.length / 25);

module.exports = {
    role: "repairer",
    getAction,
    getRequired,
    blueprint: [MOVE, CARRY, WORK],
};
