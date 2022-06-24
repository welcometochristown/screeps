const { targetedAt } = require("util.social");
const { closest } = require("util.geography");
const { isWorker } = require("util.creep");

const isSourceFull = (source) => {
    //get room info memory object
    var roomInfo = Memory.rooms.find((i) => i.room.name == source.room.name);

    //info about the source
    var sourceInfo = roomInfo.sources.find((i) => i.source.id == source.id);

    //current count of creeps working on this source
    var creepCount = targetedAt(source).length;

    return creepCount >= sourceInfo.limit;
};

const harvest = (creep, room) => {
    if (!isWorker(creep)) {
        creep.memory.target = undefined;
        creep.memory.action = undefined;
        return;
    }

    var sources = room.find(FIND_SOURCES, {
        filter: (source) => source.energy > 0,
    });

    if (!creep.memory.target) {
        var closestSource = closest(creep, sources);

        //TODO: Update to work with multiple rooms
        while (sources.length) {
            //get the next closest source
            var source = closest(creep, sources);

            //if source is full, remove from list and lets go again
            if (isSourceFull(source)) {
                sources = _.filter(sources, (s) => s.id !== source.id);
            } else {
                closestSource = source;
                break;
            }
        }

        creep.memory.target = closestSource;
    }

    if (creep.memory.target) {
        var source = sources.find((s) => s.id === creep.memory.target.id);

        if (!source) {
            //current target is no longer in valid source list, find a new one
            creep.memory.target = undefined;
            return;
        }

        if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
            creep.moveTo(source);
        }
    }

    if (creep.carry.energy == creep.carryCapacity) {
        //harvesters should transfer the energy, but other harvesting creeps may want to use the energy for something else
        creep.memory.action =
            creep.memory.role == "harvester" ? "transfer" : undefined;
        creep.memory.target = undefined;
    }
};

module.exports = {
    run: harvest,
    action: "harvest",
};
