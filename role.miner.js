const { minerals } = require("util.resource");

const getAction = (creep) => {
    if (!getRequired(creep.room)) return "harvest";
    return "mine";
};

const getRequired = (
    room,
    deposits = room.find(FIND_MINERALS, {
        filter: (deposit) => deposit.mineralAmount > 0,
    }),
    storages = room.find(FIND_MY_STRUCTURES, {
        filter: (structure) =>
            structure.structureType == STRUCTURE_STORAGE &&
            _.sum(minerals, (mineral) => structure.store[mineral]) /
                structure.store.getCapacity() <=
                0.5, //store if there is less than 50% of space used by minerals
    }),
    extractors = room.find(FIND_MY_STRUCTURES, {
        filter: (structure) => structure.structureType == STRUCTURE_EXTRACTOR,
    })
) => {
    return storages.length > 0 && extractors.length > 0 ? deposits.length : 0;
};

module.exports = {
    role: "miner",
    getAction,
    getRequired,
    blueprint: [MOVE, CARRY, WORK],
};
