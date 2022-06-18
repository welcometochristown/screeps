const getAction = (creep) => {
    return "courier";
};

const minRequired = (room) => 1;

module.exports = {
    role: "courier",
    getAction,
    minRequired,
    blueprint: [MOVE, CARRY],
};
