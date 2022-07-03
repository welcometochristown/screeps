const { allConstructionSites } = require("util.geography");

const getAction = (creep) => {
    //if there are no construction sites, then repair duty
    if (!allConstructionSites(creep.room).length) {
        return "repair";
    }

    //default build
    return "build";
};

const getRequired = (room, sites = allConstructionSites(room)) => {
    const remainingBuildProgress = _.sum(
        sites,
        (site) => site.progressTotal - site.progress
    );
    return Math.min(remainingBuildProgress / 3000, 2);
};

module.exports = {
    role: "builder",
    getAction,
    getRequired,
    blueprint: [MOVE, CARRY, WORK],
};
