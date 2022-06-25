const { closest } = require("util.geography");

const mine = (creep, room) => {
    if (!isWorker(creep)) {
        creep.memory.target = undefined;
        creep.memory.action = undefined;
        return;
    }

    if (creep.store.getFreeCapacity() == 0) {
        creep.memory.action = "transfer";
        creep.memory.target = undefined;
        return;
    }

    if (creep.memory.target) {
        creep.memory.target = Game.getObjectById(creep.memory.target.id);
    }

    if (!creep.memory.target) {
        const deposits = room.find(FIND_MINERALS, {
            filter: (deposit) => deposit.mineralAmount > 0,
        });

        if (deposits.length) {
            creep.memory.target = closest(creep, deposits);
            if (creep.harvest(target) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target);
            }
            return;
        }
    }

    //no targets to pickup
    creep.memory.action = undefined;
    creep.memory.target = undefined;
};

module.exports = {
    run: mine,
    action: "mine",
};
