const { energyStored, energyCapacity } = require("./util.resource");

const getAction = (creep) => {
    return "courier";
};

const minRequired = (room) => {
    let required = Math.max(
        1,
        Math.floor(
            room.find(FIND_STRUCTURES, {
                filter: { structureType: STRUCTURE_EXTENSION },
            }).length / 8
        )
    );

    const spawnAndExtensionCapacity = energyCapacity(room, [
        STRUCTURE_SPAWN,
        STRUCTURE_EXTENSION,
    ]);

    if (spawnAndExtensionCapacity > 0) {
        const extraPercentage =
            Math.floor(
                energyStored(room, [STRUCTURE_CONTAINER]) /
                    spawnAndExtensionCapacity
            ) * 100;

        //add an extra courier for every extra 500% we have
        required += Math.floor(extraPercentage / 500);
    }

    return required;
};

module.exports = {
    role: "courier",
    getAction,
    minRequired,
    blueprint: [MOVE, CARRY],
};
