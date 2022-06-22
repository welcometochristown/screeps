const getAction = (creep) => {
    return "courier";
};

const minRequired = (room) =>
    Math.max(
        1,
        Math.floor(
            room.find(FIND_STRUCTURES, {
                filter: { structureType: STRUCTURE_EXTENSION },
            }).length / 8
        )
    );

module.exports = {
    role: "courier",
    getAction,
    minRequired,
    blueprint: [MOVE, CARRY],
};
