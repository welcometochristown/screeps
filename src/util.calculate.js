const parts = {
    MOVE: 50,
    WORK: 100,
    CARRY: 50,
    ATTACK: 80,
    RANGED_ATTACK: 150,
    HEAL: 250,
    CLAIM: 600,
    TOUGH: 10,
};

module.exports = {
    cost: (body) => _.sum(body, (i) => parts[i.toString().toUpperCase()]),

    // (Number of body parts, excluding MOVE and empty CARRY parts)
    weight: (body) => {
        var exclude = ["MOVE", "CARRY"];
        return _.filter(
            body,
            (i) => !exclude.includes(i.toString().toUpperCase())
        ).length;
    },

    availableBuildEnergy: (room) => {
        var energyStructures = room.find(FIND_MY_STRUCTURES, {
            filter: (structure) =>
                [STRUCTURE_SPAWN, STRUCTURE_EXTENSION].includes(
                    structure.structureType
                ),
        });
        return _.sum(
            energyStructures,
            (structure) => structure.store[RESOURCE_ENERGY]
        );
    },

    parts: parts,
};
