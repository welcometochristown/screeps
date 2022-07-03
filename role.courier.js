const { energyStored, energyCapacity } = require("./util.resource");

const getAction = (creep) => {
    return "courier";
};

const getRequired = (room) => {
    //minimum 1 courier, 1 courier per 10 extensions
    let required = Math.max(
        1,
        Math.floor(
            room.find(FIND_STRUCTURES, {
                filter: { structureType: STRUCTURE_EXTENSION },
            }).length / 10
        )
    );

    return required;
};

module.exports = {
    role: "courier",
    getAction,
    getRequired,
    blueprint: [MOVE, CARRY],
};
