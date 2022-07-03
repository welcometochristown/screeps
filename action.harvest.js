const { closest } = require("util.geography");
const { isWorker } = require("util.creep");
const { isSourceFull } = require("util.resource");

const harvest = (creep, room) => {
    if (!isWorker(creep)) {
        creep.memory.target = undefined;
        creep.memory.action = undefined;
        return;
    }

    //if creep has no target, or target is empty find a new one
    if (!creep.memory.target || creep.memory.target.energy == 0) {
        let sources = room.find(FIND_SOURCES, {
            filter: (source) => source.energy > 0,
        });

        let emptySources = _.filter(sources, (source) => !isSourceFull(source));

        if (emptySources.length) {
            creep.memory.target = closest(creep, emptySources);
        } else {
            creep.memory.target = closest(creep, sources);
        }
    }

    //move to target and harvest
    if (creep.memory.target) {
        if (creep.harvest(creep.memory.target) === ERR_NOT_IN_RANGE) {
            creep.moveTo(creep.memory.target);
            return;
        }
    }

    //finished harvesting because capacity is full
    if (creep.store.getFreeCapacity() === 0) {
        creep.memory.action = undefined;
        creep.memory.target = undefined;
    }
};

module.exports = {
    run: harvest,
    action: "harvest",
};
