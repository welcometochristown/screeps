const { targetedAt } = require("util.social");
const { closest } = require("util.geography");

const harvest = (creep) => {
    var sources = creep.room.find(FIND_SOURCES);

    if (!creep.memory.target) {
        var closestSource = closest(creep, sources);

        while (sources.length) {
            //get the next closest source
            var source = closest(creep, sources);

            //get source information (i.e limit)
            var sourceInfo = Memory.sourceInfo.find(
                (i) => i.source.id === source.id
            );

            //current count of creeps working on this source
            var creepCount = targetedAt(source);

            if (creepCount >= sourceInfo.limit) {
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
