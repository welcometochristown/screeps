const { closestEnergyTransfer } = require("./util.geography");

const getAction = (creep) => {
    if (closestEnergyTransfer(creep)) {
        return "harvest"; //harvest if there are empty sources to store it in
    } else if (creep.room.find(FIND_MY_CONSTRUCTION_SITES).length) {
        return "build"; //assist with building if there are construction sites
    } else {
        return "upgrade"; //otherwise upgrade duty
    }
};

const minRequired = (room) => room.find(FIND_SOURCES).length;

module.exports = {
    role: "harvester",
    getAction,
    minRequired,
    blueprint: [MOVE, CARRY, WORK],
};
