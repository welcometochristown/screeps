const getAction = (creep) => {
    if (!minRequired(creep.room)) return "harvest";
    return "mine";
};

const minRequired = (
    room,
    deposits = room.find(FIND_MINERALS, {
        filter: (deposit) => deposit.mineralAmount > 0,
    }),
    storages = room.find(FIND_MY_STRUCTURES, {
        filter: (structure) =>
            structure.structureType == STRUCTURE_STORAGE &&
            structure.store[RESOURCE_HYDROGEN] +
                structure.store[RESOURCE_OXYGEN] +
                structure.store[RESOURCE_UTRIUM] +
                structure.store[RESOURCE_LEMERGIUM] +
                structure.store[RESOURCE_KEANIUM] +
                structure.store[RESOURCE_ZYNTHIUM] +
                structure.store[RESOURCE_CATALYST] +
                structure.store[RESOURCE_GHODIUM] /
                    structure.store.getCapacity() <=
                0.5, //store if there is less than 50% of space used by minerals
    })
) => {
    return storages.length > 0 ? deposits.length : 0;
};

module.exports = {
    role: "miner",
    getAction,
    minRequired,
    blueprint: [MOVE, CARRY, WORK],
};
