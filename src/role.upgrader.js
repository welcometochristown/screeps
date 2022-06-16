const getAction = (creep) => {
    return "upgrade"; //always try and upgrade
};

const minRequired = (room) => (room.controller ? 1 : 0);

module.exports = {
    role: "upgrader",
    getAction,
    minRequired,
    blueprint: [MOVE, CARRY, WORK],
};
