const { closest } = require("./util.geography");

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

        //spawns with space
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

    // const droppedEnergy = creep.room.find(FIND_DROPPED_RESOURCES, {
    //     filter: { resourceType: RESOURCE_ENERGY },
    // });

    // if (droppedEnergy.length > 0) {
    //     var target = closest(creep, droppedEnergy);
    //     creep.memory.target = target;
    //     creep.memory.action = "pickup";
    //     return;
    // }

    const tombStones = creep.room.find(FIND_TOMBSTONES, {
        filter: (tombstone) => tombstone.store[RESOURCE_ENERGY] > 0,
    });

    if (tombStones.length > 0) {
        var target = closest(creep, tombStones);
        creep.memory.target = target;
        creep.memory.action = "withdraw";
        return;
    }

    const containers = creep.room.find(FIND_STRUCTURES, {
        filter: (structure) =>
            structure.structureType == STRUCTURE_CONTAINER &&
            structure.store[RESOURCE_ENERGY] > 0,
    });

    if (containers.length) {
        creep.memory.target = closest(creep, containers);
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
