const { closest } = require("./util.geography");
const { isWorker } = require("./util.creep");
const { targetedAt } = require("./util.creep");

const repair = (creep, room, maxWallSize = 50000, wallchunk = 5000) => {
    if (!isWorker(creep)) {
        creep.memory.target = undefined;
        creep.memory.action = undefined;
        return;
    }

    if (creep.store[RESOURCE_ENERGY] == 0) {
        creep.memory.action = "withdraw";
        creep.memory.target = undefined;
        return;
    }

    //if no target in memory, or the target is now fully repaired find another
    if (
        !creep.memory.target ||
        creep.memory.target.hits == creep.memory.target.hitsMax ||
        [STRUCTURE_WALL, STRUCTURE_RAMPART].includes(creep.memory.target.structureType) // change wall/rampart building site every {wallchunk}
    ) {
        const targets = room.find(FIND_STRUCTURES, {
            filter: (structure) => structure.hits < structure.hitsMax && targetedAt(structure).length == 0,
        });

        const nonWallTargets = _.filter(
            targets,
            (target) => ![STRUCTURE_WALL, STRUCTURE_RAMPART].includes(target.structureType)
        );
        const wallTargets = _.filter(
            targets,
            (target) => [STRUCTURE_WALL, STRUCTURE_RAMPART].includes(target.structureType) && target.hits < maxWallSize //only build to {maxWallSize}
        );

        if (creep.memory.role == "repairer" && nonWallTargets.length)
            creep.memory.target = closest(creep, nonWallTargets);
        else if (wallTargets.length) {
            const minRange = _.min(wallTargets.map((target) => Math.floor(target.hits / wallchunk)));
            const minRangeWallTargets = _.filter(
                wallTargets,
                (target) => Math.floor(target.hits / wallchunk) == minRange
            );

            creep.memory.target = closest(creep, minRangeWallTargets);
        }
    }

    //try and find a target, move and repair it
    if (creep.memory.target) {
        if (creep.repair(creep.memory.target) == ERR_NOT_IN_RANGE) {
            creep.moveTo(creep.memory.target);
        }
        return;
    }

    //nothing to repair
    creep.memory.action = undefined;
    creep.memory.target = undefined;
};

module.exports = {
    run: repair,
    action: "repair",
};
