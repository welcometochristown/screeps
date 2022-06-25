const { closest } = require("util.geography");

const wait = (creep, room) => {
    const waitingFlags = room.find(FIND_FLAGS, {
        filter: (flag) => flag.name.toLowerCase().startsWith("wait"),
    });
    const target = closest(creep, waitingFlags);
    if (target) {
        creep.moveTo(target);
    }

    //reset these so creep will stop waiting at some point
    creep.memory.action = undefined;
    creep.memory.target = undefined;
};

module.exports = {
    run: wait,
    action: "wait",
};
