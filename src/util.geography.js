const closest = (creep, targets) => {
    return _.sortBy(targets, (s) => creep.pos.getRangeTo(s))[0];
};

module.exports = {
    //closest place to transfer energy to that has availability
    closestEnergyTransfer: (
        creep,
        ignoreSpawn = false,
        prioritizeSpawn = true
    ) => {
        var energyStructures = creep.room.find(FIND_MY_STRUCTURES, {
            filter: (structure) =>
                [
                    STRUCTURE_SPAWN,
                    STRUCTURE_EXTENSION,
                    STRUCTURE_STORAGE,
                ].includes(structure.structureType) &&
                structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0,
        });

        if (
            prioritizeSpawn &&
            _.some(
                energyStructures,
                (structure) => structure.structureType == STRUCTURE_SPAWN
            )
        ) {
            energyStructures = _.filter(
                energyStructures,
                (structure) => structure.structureType == STRUCTURE_SPAWN
            );
        }

        if (
            ignoreSpawn &&
            _.some(
                energyStructures,
                (structure) => structure.structureType == STRUCTURE_SPAWN
            )
        ) {
            energyStructures = _.filter(
                energyStructures,
                (structure) => structure.structureType != STRUCTURE_SPAWN
            );
        }

        return closest(creep, energyStructures);
    },

    //closest place to withdraw energy
    closestEnergyStorage: (
        creep,
        ignoreSpawn = false,
        prioritizeNonSpawn = true
    ) => {
        var energyStructures = creep.room.find(FIND_MY_STRUCTURES, {
            filter: (structure) =>
                [
                    STRUCTURE_SPAWN,
                    STRUCTURE_EXTENSION,
                    STRUCTURE_STORAGE,
                ].includes(structure.structureType) &&
                structure.store[RESOURCE_ENERGY] > 1, //1 because we dont want to keep milking the spawn at 1 energy each time
        });

        if (
            prioritizeNonSpawn &&
            _.some(
                energyStructures,
                (structure) => structure.structureType != STRUCTURE_SPAWN
            )
        ) {
            energyStructures = _.filter(
                energyStructures,
                (structure) => structure.structureType != STRUCTURE_SPAWN
            );
        }

        if (
            ignoreSpawn &&
            _.some(
                energyStructures,
                (structure) => structure.structureType == STRUCTURE_SPAWN
            )
        ) {
            energyStructures = _.filter(
                energyStructures,
                (structure) => structure.structureType != STRUCTURE_SPAWN
            );
        }

        return closest(creep, energyStructures);
    },
    closest,
};
