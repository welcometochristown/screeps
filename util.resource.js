const minerals = [
    RESOURCE_HYDROGEN,
    RESOURCE_OXYGEN,
    RESOURCE_UTRIUM,
    RESOURCE_LEMERGIUM,
    RESOURCE_KEANIUM,
    RESOURCE_ZYNTHIUM,
    RESOURCE_CATALYST,
    RESOURCE_GHODIUM,
];

const energyStored = (
    room,
    structureTypes = [STRUCTURE_CONTAINER, STRUCTURE_STORAGE]
) =>
    _.sum(
        room.find(FIND_STRUCTURES, {
            filter: (s) => structureTypes.includes(s.structureType),
        }),
        (s) => s.store[RESOURCE_ENERGY]
    );

const energyCapacity = (
    room,
    structureTypes = [STRUCTURE_CONTAINER, STRUCTURE_STORAGE]
) =>
    _.sum(
        room.find(FIND_STRUCTURES, {
            filter: (s) => structureTypes.includes(s.structureType),
        }),
        (s) => s.store.getCapacity(RESOURCE_ENERGY)
    );

const energyStoredPercentage = (room, structureTypes) => {
    const capacity = energyCapacity(room, structureTypes);
    const stored = energyStored(room, structureTypes);

    return capacity == 0 ? 0 : stored / capacity;
};

module.exports = {
    energyStored,
    energyCapacity,
    energyStoredPercentage,
    minerals,
};
