const { closest, linkPair } = require("./util.geography");
const { targetedAt } = require("./util.creep");
const { energyStoredPercentage } = require("./util.resource");

const setCourierTarget = (creep, room, find, filter, action) => {
    const items = room.find(find, { filter });

    if (!items.length) {
        return false;
    }

    creep.memory.target = closest(creep, items);
    creep.memory.action = action;
    return true;
};

const setCourierTransfer = (creep, room, find, structureType) =>
    setCourierTarget(
        creep,
        room,
        find,
        (structure) =>
            (!structureType || structure.structureType == structureType) &&
            structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0,
        "transfer"
    );

const setCourierWithdraw = (creep, room, find, structureType, singleTargetOnly = true) =>
    setCourierTarget(
        creep,
        room,
        find,
        (structure) =>
            (!structureType || structure.structureType == structureType) &&
            (!singleTargetOnly || targetedAt(structure).length == 0) &&
            structure.store[RESOURCE_ENERGY] > 0,
        "withdraw"
    );

const courier = (creep, room) => {
    if (creep.store[RESOURCE_ENERGY] > 0) {
        if (setCourierTransfer(creep, room, FIND_MY_STRUCTURES, STRUCTURE_SPAWN)) {
            return;
        }
        //prettier-ignore
        if (setCourierTransfer(creep, room, FIND_MY_STRUCTURES, STRUCTURE_EXTENSION)) {
            return;
        }
        //prettier-ignore
        if (setCourierTransfer(creep, room, FIND_MY_STRUCTURES, STRUCTURE_TOWER)) {
            return;
        }
        //prettier-ignore
        if (setCourierTransfer(creep, room, FIND_MY_STRUCTURES, STRUCTURE_STORAGE)) {
            return;
        }
        //prettier-ignore
        if (setCourierTransfer(creep, room, FIND_STRUCTURES, STRUCTURE_CONTAINER)) {
            return;
        }
    }

    //creep has no free capacity, and we found no target for the energy
    if (creep.store.getFreeCapacity() == 0) {
        creep.memory.target = undefined;
        creep.memory.action = undefined;
        return;
    }

    //TODO : keeps getting -7 errors. no idea why
    // also issues with accessing the energy store
    // //prettier-ignore
    // if(setCourierWithdraw(creep, room, FIND_DROPPED_RESOURCES))
    //     return;

    //prettier-ignore
    if(setCourierWithdraw(creep, room, FIND_TOMBSTONES))
        return;

    //prettier-ignore
    if(setCourierWithdraw(creep, room, FIND_RUINS))
        return;

    const pair = linkPair(creep.room);
    if (pair && pair.reciever.store[RESOURCE_ENERGY] > 0) {
        creep.memory.target = pair.reciever;
        creep.memory.action = "withdraw";
        return;
    }

    //prettier-ignore
    if (energyStoredPercentage(room, [STRUCTURE_SPAWN, STRUCTURE_EXTENSION]) < 1) {
        if(!setCourierWithdraw(creep, room, FIND_MY_STRUCTURES, STRUCTURE_STORAGE, false))
            return;
    }

    //prettier-ignore
    if(setCourierWithdraw(creep, room, FIND_STRUCTURES, STRUCTURE_CONTAINER, false))
        return;

    creep.memory.target = undefined;
    creep.memory.action = undefined;
};

module.exports = {
    run: courier,
    action: "courier",
};
