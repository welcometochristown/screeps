const { closest, linkPair } = require("./util.geography");
const { targetedAt } = require("./util.creep");

const courier = (creep, room) => {
    if (creep.store[RESOURCE_ENERGY] > 0) {
        //spawns with space
        const spawns = room.find(FIND_MY_STRUCTURES, {
            filter: (structure) =>
                structure.structureType == STRUCTURE_SPAWN &&
                structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0,
        });

        if (spawns.length) {
            creep.memory.target = closest(creep, spawns);
            creep.memory.action = "transfer";
            return;
        }

        //extensions with space
        const extensions = room.find(FIND_MY_STRUCTURES, {
            filter: (structure) =>
                structure.structureType == STRUCTURE_EXTENSION &&
                structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0,
        });

        if (extensions.length) {
            creep.memory.target = closest(creep, extensions);
            creep.memory.action = "transfer";
            return;
        }

        //load towers too
        const towers = room.find(FIND_MY_STRUCTURES, {
            filter: (structure) =>
                structure.structureType == STRUCTURE_TOWER &&
                structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0,
        });

        if (towers.length) {
            creep.memory.target = closest(creep, towers);
            creep.memory.action = "transfer";
            return;
        }

        //put everything else in the main storage
        const storages = room.find(FIND_MY_STRUCTURES, {
            filter: (structure) =>
                structure.structureType == STRUCTURE_STORAGE &&
                structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0,
        });

        if (storages.length) {
            creep.memory.target = closest(creep, storages);
            creep.memory.action = "transfer";
            return;
        }
    }

    //TODO : keeps getting -7 errors. no idea why
    // const droppedEnergy = room.find(FIND_DROPPED_RESOURCES, {
    //     filter: { resourceType: RESOURCE_ENERGY },
    // });

    // if (droppedEnergy.length > 0) {
    //     console.log("picking up dropped energy ");
    //     let target = closest(creep, droppedEnergy);
    //     creep.memory.target = target;
    //     creep.memory.action = "pickup";
    //     return;
    // }

    const tombStones = room.find(FIND_TOMBSTONES, {
        filter: (tombstone) =>
            tombstone.store[RESOURCE_ENERGY] > 0 &&
            targetedAt(tombstone).length == 0,
    });
    if (tombStones.length) {
        creep.memory.target = closest(creep, tombStones);
        creep.memory.action = "withdraw";
        return;
    }

    const ruins = room.find(FIND_RUINS, {
        filter: (ruin) =>
            ruin.store[RESOURCE_ENERGY] > 0 && targetedAt(ruin).length == 0,
    });

    if (ruins.length) {
        creep.memory.target = closest(creep, ruins);
        creep.memory.action = "withdraw";
        return;
    }

    const pair = linkPair(creep.room);
    if (pair && pair.reciever.store[RESOURCE_ENERGY] > 0) {
        creep.memory.target = pair.reciever;
        creep.memory.action = "withdraw";
        return;
    }

    const containers = room.find(FIND_STRUCTURES, {
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
    creep.memory.action = "wait";
};

module.exports = {
    run: courier,
    action: "courier",
};
