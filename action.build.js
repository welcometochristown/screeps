const { closest } = require("util.geography");
const { isWorker } = require("util.creep");
const { filterByPriority } = require("util.common");
const { allConstructionSites } = require("util.geography");

const build = (creep, room) => {
    //only worker creeps can build
    if (!isWorker(creep)) {
        creep.memory.target = undefined;
        creep.memory.action = undefined;
        return;
    }

    //if we have no energy to build, time to withdraw some
    if (creep.store[RESOURCE_ENERGY] == 0) {
        creep.memory.action = "withdraw";
        creep.memory.target = undefined;
        return;
    }

    //not already building something, or progress is complete. find a new target
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

    //move to build target and build
    if (creep.memory.target) {
        if (creep.build(creep.memory.target) == ERR_NOT_IN_RANGE) {
            creep.moveTo(creep.memory.target);
        }
        return;
    }

    //no action taken
    creep.memory.action = undefined;
    creep.memory.target = undefined;
};

module.exports = {
    run: build,
    action: "build",
};
