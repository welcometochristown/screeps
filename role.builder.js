const { allConstructionSites } = require("util.geography");

const roadCount = (sites) =>
    Math.ceil(_.filter(sites, (s) => s.structureType == STRUCTURE_ROAD).length);

const nonRoadCount = (sites) =>
    Math.ceil(_.filter(sites, (s) => s.structureType != STRUCTURE_ROAD).length);

const getAction = (creep) => {
    if (!allConstructionSites(creep.room).length) {
        return "repair";
    }

    return "build";
};

const minRequired = (room, sites = allConstructionSites(room)) =>
    Math.ceil((roadCount(sites) / 10 + nonRoadCount(sites)) / 10);

module.exports = {
    role: "builder",
    getAction,
    minRequired,
    blueprint: [MOVE, CARRY, WORK],
};
