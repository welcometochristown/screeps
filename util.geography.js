const closest = (creep, targets) => {
    return _.sortBy(targets, (s) => creep.pos.getRangeTo(s))[0];
};

const getEnergyStructures = (room) => {
    var myEnergyStructures = room.find(FIND_MY_STRUCTURES, {
        filter: (structure) =>
            [
                STRUCTURE_SPAWN,
                STRUCTURE_EXTENSION,
                STRUCTURE_CONTAINER,
                STRUCTURE_STORAGE,
            ].includes(structure.structureType),
    });

    var otherEnergyStructures = room.find(FIND_STRUCTURES, {
        filter: (structure) =>
            [STRUCTURE_CONTAINER].includes(structure.structureType),
    });

    return [...myEnergyStructures, ...otherEnergyStructures];
};

module.exports = {
    //closest place to transfer energy to that has availability
    closestEnergyTransfer: (
        creep,
        ignoreSpawn = false,
        prioritizeSpawn = true
    ) => {
        var energyStructures = _.filter(
            getEnergyStructures(creep.room),
            (s) => s.store.getFreeCapacity(RESOURCE_ENERGY) > 0
        );

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
        var energyStructures = _.filter(
            getEnergyStructures(creep.room),
            (s) => s.store[RESOURCE_ENERGY] > 1
        );

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