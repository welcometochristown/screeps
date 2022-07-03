const { energyStored } = require("util.resource");

const getAction = (creep) => {
    return "upgrade"; //always try and upgrade
};

const getRequired = (room) => {
    if (!room.controller) return 0;
    return Math.max(Math.floor(energyStored(room) / 25000), 1);
};

module.exports = {
    role: "upgrader",
    getAction,
    getRequired,
    blueprint: [MOVE, CARRY, WORK],
};
