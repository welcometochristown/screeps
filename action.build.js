const { closest } = require("util.geography");
const { isWorker } = require("util.creep");

const build = (creep) => {
    if (!isWorker(creep)) {
        creep.memory.target = undefined;
        creep.memory.action = undefined;
        return;
    }

    //if we have no energy to build, time to withdraw some
    if (creep.carry.energy == 0) {
        creep.memory.action =
            creep.memory.role == "builder" || "repairer"
                ? "withdraw"
                : undefined;
        creep.memory.target = undefined;
        return;
    }

    const sites = creep.room.find(FIND_MY_CONSTRUCTION_SITES);

    //are we building anything else than roads? roads are low priority
    const hasNonRoadConstructionSites = !!_.some(
        sites,
        (s) => s.structureType !== STRUCTURE_ROAD
    ).length;

    //find the closet construction site (ignore roads if there are non road construction sites)
    creep.memory.target = closest(
        creep,
        _.filter(
            sites,
            (s) =>
                !hasNonRoadConstructionSites ||
                s.structureType !== STRUCTURE_ROAD
        )
    );

    //if there are no construction sites, kill thyself
    if (!creep.memory.target) {
        creep.memory.action =
            creep.memory.role == "builder" ? "suicide" : undefined;
        creep.memory.target = undefined;
    }

    //move to build target and build
    if (creep.build(creep.memory.target) == ERR_NOT_IN_RANGE) {
        creep.moveTo(creep.memory.target);
        return;
    }
};

module.exports = {
    run: build,
    action: "build",
};
