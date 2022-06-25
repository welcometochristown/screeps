const { isWorker } = require("util.creep");

const upgrade = (creep, room) => {
    if (!isWorker(creep)) {
        creep.memory.target = undefined;
        creep.memory.action = undefined;
        return;
    }

    if (creep.store[RESOURCE_ENERGY] == 0) {
        creep.memory.action = "withdraw";
        creep.memory.target = undefined;
        return;
    }

    creep.memory.target = room.controller;

    if (creep.upgradeController(creep.memory.target) == ERR_NOT_IN_RANGE) {
        creep.moveTo(creep.memory.target);
    }
};

module.exports = {
    run: upgrade,
    action: "upgrade",
};
