const { closest } = require("util.geography");
const { isWorker } = require("util.creep");
const { filterByPriority } = require("util.common");
const { allConstructionSites } = require("util.geography");

const build = (creep, room) => {
    if (!isWorker(creep)) {
        creep.memory.target = undefined;
        creep.memory.action = undefined;
        return;
    }

    //if we have no energy to build, time to withdraw some
    if (creep.store[RESOURCE_ENERGY] == 0) {
        creep.memory.action =
            creep.memory.role == "builder" || "repairer"
                ? "withdraw"
                : undefined;
        creep.memory.target = undefined;
        return;
    }

    if (creep.memory.target) {
        creep.memory.target = Game.getObjectById(creep.memory.target.id);
    }

    //not already building something, or progress is complete
    if (!creep.memory.target || creep.memory.target.progress === undefined) {
        const sites = allConstructionSites(room);

        const prioritisedSites = filterByPriority(
            sites,
            [
                STRUCTURE_SPAWN,
                STRUCTURE_TOWER,
                STRUCTURE_EXTENSION,
                STRUCTURE_STORAGE,
                STRUCTURE_ROAD,
            ],
            (item) => item.structureType
        );

        creep.memory.target = closest(creep, prioritisedSites);
    }

    //if there are still no construction sites
    if (!creep.memory.target) {
        creep.memory.action =
            creep.memory.role == "builder" ? "harvest" : undefined;
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
