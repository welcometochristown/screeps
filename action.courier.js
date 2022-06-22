const { closest, closestEnergyStorage } = require("./util.geography");
const { energyCapacity, energyStored } = require("./util.resource");
const { targetedAt } = require("./util.social");

const courier = (creep) => {
    if (creep.carry.energy > 0) {
        //spawns with space
        const spawns = creep.room.find(FIND_MY_STRUCTURES, {
            filter: (structure) =>
                structure.structureType == STRUCTURE_SPAWN &&
                structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0,
        });

        if (spawns.length) {
            creep.memory.target = closest(creep, spawns);
            creep.memory.action = "transfer";
            return;
        }

        //only fill turrets if we have enough energy to fill the spawn structure (SPAWN, EXTENSION)
        if (
            energyStored(creep.room) >
            energyCapacity(creep.room, [STRUCTURE_SPAWN, STRUCTURE_EXTENSION])
        ) {
            //load towers too
            const towers = creep.room.find(FIND_MY_STRUCTURES, {
                filter: (structure) =>
                    structure.structureType == STRUCTURE_TOWER &&
                    structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0,
            });

            if (towers.length) {
                creep.memory.target = closest(creep, towers);
                creep.memory.action = "transfer";
                return;
            }
        }

        //extensions with space
        const extensions = creep.room.find(FIND_MY_STRUCTURES, {
            filter: (structure) =>
                structure.structureType == STRUCTURE_EXTENSION &&
                structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0,
        });

        if (extensions.length) {
            creep.memory.target = closest(creep, extensions);
            creep.memory.action = "transfer";
            return;
        }
    }

    //TODO : keeps getting -7 errors. no idea why
    // const droppedEnergy = creep.room.find(FIND_DROPPED_RESOURCES, {
    //     filter: { resourceType: RESOURCE_ENERGY },
    // });

    // if (droppedEnergy.length > 0) {
    //     console.log("picking up dropped energy ");
    //     var target = closest(creep, droppedEnergy);
    //     creep.memory.target = target;
    //     creep.memory.action = "pickup";
    //     return;
    // }

    const tombStones = creep.room.find(FIND_TOMBSTONES, {
        filter: (tombstone) =>
            tombstone.store[RESOURCE_ENERGY] > 0 &&
            targetedAt(tombstone).length == 0,
    });

    //TODO: add check so only one courier goes to tombstones
    if (tombStones.length) {
        creep.memory.target = closest(tombStones);
        creep.memory.action = "withdraw";
        return;
    }

    const closestStore = closestEnergyStorage(creep);

    if (closestStore) {
        creep.memory.target = closestStore;
        creep.memory.action = "withdraw";
        return;
    }

    creep.memory.target = undefined;
    creep.memory.action = undefined;
};

module.exports = {
    run: courier,
    action: "courier",
};
