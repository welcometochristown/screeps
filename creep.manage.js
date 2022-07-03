const { modules, getCreepsByRole } = require("util.social");
const { energyStored } = require("util.resource");
const spawner = require("creep.spawn");
const { energyCapacity } = require("./util.resource");
const { getRequired: minCouriersRequired } = require("./role.courier");

//keep track of how max amount of screeps we want based on existing structures that need action
const register = [
    { priority: 0, module: modules.harvester, sizeLimit: 4 },
    { priority: 1, module: modules.upgrader, sizeLimit: 5 },
    { priority: 2, module: modules.builder, sizeLimit: 4 },
    { priority: 3, module: modules.courier, sizeLimit: 3 },
    { priority: 4, module: modules.repairer, sizeLimit: 3 },
    // { priority: 5, module: modules.miner, sizeLimit: 0 },   ///needs an extractor
    { priority: 6, module: modules.scout, sizeLimit: 2 },
];

//false for disabled
const PAUSE_SPAWNING = false;

// 0 for disabled
const GLOBAL_SIZE_LIMIT = 3;

//-1 for disabled
const FIXED_RATIO = 0.5;

//spawn each role one at a time, in priority order
const nextSpawn = (room) => {
    let nextSpawn = undefined;
    for (let c in _.sortBy(register, (r) => r.priority)) {
        let item = register[c];

        //how many creeps required for this room
        let requiredCreeps = item.module.getRequired(room);

        //how many creeps do we have of this role in this room currently?
        let actualCreeps = _.size(getCreepsByRole(room, item.module.role));

        // console.log(
        //     `${room.name} ${item.module.role} ${actualCreeps}/${requiredCreeps}`
        // );

        //do we already have enough assigned for this role?
        if (actualCreeps >= requiredCreeps) continue;

        if (!nextSpawn || nextSpawn.actualCreeps > actualCreeps)
            nextSpawn = { item, actualCreeps };
    }

    return !nextSpawn ? undefined : nextSpawn.item;
};

module.exports = {
    nextSpawn,
    run: (room, next = nextSpawn(room)) => {
        if (PAUSE_SPAWNING || !next) return;

        //console.log(`next build in ${room.name}: ${next.module.role}`);

        const couriers = getCreepsByRole(room, "courier").length;
        const minCouriers = minCouriersRequired(room);

        const ratio =
            FIXED_RATIO > -1
                ? FIXED_RATIO
                : minCouriers == 0
                ? 0
                : couriers / minCouriers;

        const extensionCapacity = energyCapacity(room, [STRUCTURE_EXTENSION]);
        const extensionStored = energyStored(room, [STRUCTURE_EXTENSION]);

        const extensionCapacityRatioed = extensionCapacity * ratio; //extension capacity we want to used based on how many couriers we have

        //are extensions full enough?
        if (extensionStored < extensionCapacityRatioed) {
            const storedEnergy = energyStored(room);

            //if we have enough energy stored
            if (storedEnergy > extensionCapacityRatioed) {
                // console.log(
                //     `${room.name} waiting for extensions to fill - ${extensionStored} < ${extensionCapacityRatioed} (${extensionCapacity}) via ratio ${ratio} (${minCouriers} / ${couriers})`
                // );
                return; //wait
            }
        }

        const size =
            GLOBAL_SIZE_LIMIT > 0
                ? Math.min(GLOBAL_SIZE_LIMIT, next.sizeLimit)
                : next.sizeLimit;

        return !next ? null : spawner.spawnCreep(room, next.module.role, size);
    },
};
