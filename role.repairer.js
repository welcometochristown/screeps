const getAction = (creep) => {
    //no structures? we aren't needed!
    if (!creep.room.find(FIND_MY_STRUCTURES).length) {
        return "suicide";
    }

    //if there are no structures with low points, lets build
    if (
        !creep.room.find(FIND_STRUCTURES, {
            filter: (object) =>
                object.hits < object.hitsMax &&
                object.structureType != STRUCTURE_WALL,
        }).length &&
        creep.room.find(FIND_MY_CONSTRUCTION_SITES).length
    ) {
        return "build";
    }

    return "repair";
};

const minRequired = (room, structures = room.find(FIND_MY_STRUCTURES)) =>
    Math.ceil(structures.length / 10);

module.exports = {
    role: "repairer",
    getAction,
    minRequired,
    blueprint: [MOVE, CARRY, WORK],
};
