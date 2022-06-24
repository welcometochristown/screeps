const { closest } = require("util.geography");

const mine = (creep, room) => {
    const deposits = room.find(FIND_MINERALS, {
        filter: (deposit) => deposit.mineralAmount > 0,
    });

    if (deposits.length) {
        const target = closest(creep, deposits);
        if (target) {
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
