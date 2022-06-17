const { modules, getCreepsByRole } = require("util.social");
const spawner = require("creep.spawn");

//keep track of how max amount of screeps we want based on existing structures that need action
const register = [
    { priority: 0, module: modules.harvester, ratio: 1, sizeLimit: 0 },
    { priority: 1, module: modules.upgrader, ratio: 1, sizeLimit: 0 },
    { priority: 2, module: modules.builder, ratio: 1, sizeLimit: 0 },
    { priority: 3, module: modules.repairer, ratio: 1, sizeLimit: 1 },
];

const PAUSE_SPAWNING = false;

const spawnQueue = (room) => {
    var queue = [];

    for (var c in _.sortBy(register, (r) => r.priority)) {
        var item = register[c];

        //how many creeps required
        var requiredCreeps = item.module.minRequired(room);

        //how many creeps do we have in this role currently?
        var actualCreeps = _.size(getCreepsByRole(item.module.role));

        //do we already have enough assigned for this role?
        if (actualCreeps >= requiredCreeps * item.ratio) continue;

        queue.push(item);
    }

    return queue;
};

module.exports = {
    spawnQueue,
    run: (room, queue = spawnQueue(room)) => {
        if (PAUSE_SPAWNING) return;

        const next = queue[0];

        if (!next) return;
        console.log(`next build : ${next.module.role}`);
        return !queue.length
            ? null
            : spawner.spawnCreep(room, next.module.role, next.sizeLimit);
    },
};
