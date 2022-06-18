const getAction = (creep) => {
    // const tombStones = creep.room.find(FIND_TOMBSTONES, {
    //     filter: (tombstone) => tombstone.store[RESOURCE_ENERGY] > 0,
    // });

    // const containers = creep.room.find(FIND_STRUCTURES, {
    //     filter: (structure) =>
    //         structure.structureType == STRUCTURE_CONTAINER &&
    //         structure.store[RESOURCE_ENERGY] > 0,
    // });

    // if (
    //     tombStones.length > 0 ||
    //     containers.length > 0 ||
    //     creep.store.energy > 0
    // ) {
    return "courier";
    //  }//
};

const minRequired = (room) => 1;

module.exports = {
    role: "courier",
    getAction,
    minRequired,
    blueprint: [MOVE, CARRY],
};
