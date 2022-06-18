const closest = (creep, targets) => {
    return _.sortBy(targets, (s) => creep.pos.getRangeTo(s))[0];
};

const getEnergyStructures = (room, filter) => {
    const myEnergyStructures = room.find(FIND_MY_STRUCTURES, {
        filter: (structure) =>
            [
                STRUCTURE_SPAWN,
                STRUCTURE_EXTENSION,
                STRUCTURE_CONTAINER,
                STRUCTURE_STORAGE,
            ].includes(structure.structureType),
    });

    const otherEnergyStructures = room.find(FIND_STRUCTURES, {
        filter: (structure) =>
            [STRUCTURE_CONTAINER].includes(structure.structureType),
    });

    return _.filter([...myEnergyStructures, ...otherEnergyStructures], (s) =>
        filter(s)
    );
};

const containsSpawns = (structures) =>
    _.some(structures, (s) => s.structureType == STRUCTURE_SPAWN);

module.exports = {
    //closest place to transfer energy to that has availability
    closestEnergyTransfer: (creep, prioritizeSpawn = true) => {
        var energyStructures = getEnergyStructures(
            creep.room,
            (s) => s.store.getFreeCapacity(RESOURCE_ENERGY) > 0
        );

        //filter to only spawns if the list contains any
        if (prioritizeSpawn && containsSpawns(energyStructures)) {
            energyStructures = _.filter(
                energyStructures,
                (s) => s.structureType == STRUCTURE_SPAWN
            );
        }

        return closest(creep, energyStructures);
    },

    //closest place to withdraw energy
    closestEnergyStorage: (creep, ignoreSpawn = false) => {
        var energyStructures = getEnergyStructures(
            creep.room,
            (s) => s.store[RESOURCE_ENERGY] > 1
        );

        //filter to only non spawns if the list contains any
        if (ignoreSpawn && containsSpawns(energyStructures)) {
            energyStructures = _.filter(
                energyStructures,
                (s) => s.structureType != STRUCTURE_SPAWN
            );
        }

        return closest(creep, energyStructures);
    },
    closest,
};
