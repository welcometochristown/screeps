const { modules, getCreepsByRole } = require("util.social");
const spawner = require("creep.spawn");

//keep track of how max amount of screeps we want based on existing structures that need action
const register = [
    { priority: 0, module: modules.harvester, ratio: 1, max: 1 },
    { priority: 1, module: modules.upgrader, ratio: 1, max: 1 },
    { priority: 2, module: modules.builder, ratio: 1, max: 1 },
    { priority: 3, module: modules.repairer, ratio: 1, max: 1 },
];

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

        queue.push(item.module.role);
    }

    return queue;
};

module.exports = {
    spawnQueue,
    run: (room, queue = spawnQueue(room)) => {
        console.log(`next build : ${queue[0]}`);
        return !queue.length ? null : spawner.spawnCreep(room, queue[0]);
    },
};
