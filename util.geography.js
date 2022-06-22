const closest = (object, targets) => {
    if (!targets) return undefined;
    if (targets.length == 0) return undefined;
    if (targets.length == 1) return targets[0];
    return _.sortBy(targets, (s) => object.pos.getRangeTo(s))[0];
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

    //closest energy storage place to withdraw energy
    closestEnergyStorage: (creep) => {
        var energyStructures = getEnergyStructures(
            creep.room,
            (s) =>
                (s.structureType == STRUCTURE_CONTAINER ||
                    s.structureType == STRUCTURE_STORAGE) &&
                s.store[RESOURCE_ENERGY] > 1
        );

        return closest(creep, energyStructures);
    },
    //construction sites in same room as creep, or spawns to be constructed in other rooms
    allConstructionSites: (creep) =>
        _.flatten(
            _.map(Game.rooms, (r) =>
                !creep || creep.room.name == r.name
                    ? r.find(FIND_MY_CONSTRUCTION_SITES)
                    : r.find(FIND_MY_CONSTRUCTION_SITES, {
                          filter: { structureType: STRUCTURE_SPAWN },
                      })
            )
        ),
    closest,
};
