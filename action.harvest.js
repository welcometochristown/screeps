const { targetedAt } = require("util.creep");
const { closest } = require("util.geography");
const { isWorker } = require("util.creep");

const isSourceFull = (source) => {
    //get room info memory object
    let roomInfo = Memory.rooms.find((i) => i.room.name == source.room.name);

    //info about the source
    let sourceInfo = roomInfo.sources.find((i) => i.source.id == source.id);

    //current count of creeps working on this source
    let creepCount = targetedAt(source).length;

    return creepCount >= sourceInfo.limit;
};

const harvest = (creep, room) => {
    if (!isWorker(creep)) {
        creep.memory.target = undefined;
        creep.memory.action = undefined;
        return;
    }

    if (creep.memory.target) {
        creep.memory.target = Game.getObjectById(creep.memory.target.id);
    }

    if (!creep.memory.target) {
        let sources = room.find(FIND_SOURCES, {
            filter: (source) => source.energy > 0,
        });
        let closestSource = closest(creep, sources);

        //TODO: Update to work with multiple rooms
        while (sources.length) {
            //get the next closest source
            let source = closest(creep, sources);

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
        creep.say("harvesting");
        switch (creep.harvest(creep.memory.target)) {
            case ERR_NOT_IN_RANGE:
                creep.moveTo(creep.memory.target);
                break;
        }
    }

    if (creep.store[RESOURCE_ENERGY] == creep.store.getCapacity()) {
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
