const { isWorker } = require("util.creep");

const upgrade = (creep) => {
    if (!isWorker(creep)) {
        creep.memory.target = undefined;
        creep.memory.action = undefined;
        return;
    }

    if (creep.carry.energy == 0) {
        creep.memory.action = "withdraw";
        creep.memory.target = undefined;
        return;
    }

    creep.memory.target = creep.room.controller;

    if (creep.upgradeController(creep.memory.target) == ERR_NOT_IN_RANGE) {
        creep.moveTo(creep.memory.target);
    }

    //upgrade complete, ready for new action
    if (creep.carry.energy == 0) {
        creep.memory.action = undefined;
        creep.memory.target = undefined;
    }
};

module.exports = {
    run: upgrade,
    action: "upgrade",
};
