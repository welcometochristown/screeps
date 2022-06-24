const { closest } = require("util.geography");

const mine = (creep, room) => {
    if (creep.store.getFreeCapacity() == 0) {
        creep.memory.action = "transfer";
        creep.memory.target = undefined;
        return;
    }

    const deposits = room.find(FIND_MINERALS, {
        filter: (deposit) => deposit.mineralAmount > 0,
    });

    if (deposits.length) {
        const target = closest(creep, deposits);
        if (target) {
            const result = creep.harvest(target);
            if (result == ERR_NOT_IN_RANGE) {
                creep.moveTo(target);
            } else if (result != OK) {
                console.log(result);
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
