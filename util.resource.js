const energyStored = (room) =>
    _.sum(
        room.find(FIND_STRUCTURES, {
            filter: { structureType: STRUCTURE_CONTAINER },
        }),
        (s) => s.store[RESOURCE_ENERGY]
    );

const energyCapacity = (room) =>
    _.sum(
        room.find(FIND_STRUCTURES, {
            filter: { structureType: STRUCTURE_CONTAINER },
        }),
        (s) => s.store.getCapacity(RESOURCE_ENERGY)
    );

const spawnEnergyCapacity = (room) =>
    _.sum(
        room.find(FIND_STRUCTURES, {
            filter: (s) => s.structureType == STRUCTURE_SPAWN,
        }),
        (s) => s.store.getCapacity(RESOURCE_ENERGY)
    );

const storedEnergyPercentage = (room) => {
    const capacity = energyCapacity(room);
    const stored = energyStored(room);

    return capacity == 0 ? 0 : stored / capacity;
};

module.exports = {
    energyStored,
    energyCapacity,
    storedEnergyPercentage,
    spawnEnergyCapacity,
};
