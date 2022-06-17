const getAction = (creep) => {
    //no structures? we aren't needed!
    if (!creep.room.find(FIND_MY_STRUCTURES).length) {
        return "suicide";
    }

    //anything to repair (below 50% health)?
    if (
        creep.room.find(FIND_STRUCTURES, {
            filter: (object) =>
                object.hits < object.hitsMax * 0.5 &&
                object.structureType != STRUCTURE_WALL,
        }).length
    ) {
        return "repair";
    }

    //anything to build?
    if (creep.room.find(FIND_MY_CONSTRUCTION_SITES).length) {
        return "build";
    }

    //transfer any energy we are carrying
    if (creep.carry.energy > 0) {
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
