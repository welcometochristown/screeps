const { modules, getCreepsByRole } = require("util.social");
const { energyStored } = require("util.resource");
const spawner = require("creep.spawn");
const { energyCapacity } = require("./util.resource");
const { minRequired: minCouriersRequired } = require("./role.courier");

//keep track of how max amount of screeps we want based on existing structures that need action
const register = [
    { priority: 0, module: modules.harvester, sizeLimit: 0 },
    { priority: 1, module: modules.upgrader, sizeLimit: 0 },
    { priority: 2, module: modules.builder, sizeLimit: 0 },
    { priority: 3, module: modules.courier, sizeLimit: 3 },
    { priority: 4, module: modules.repairer, sizeLimit: 2 },
    { priority: 5, module: modules.scout, sizeLimit: 0 },
];

const PAUSE_SPAWNING = false;

//spawn each role one at a time, in priority order
const nextSpawn = (room) => {
    var nextSpawn = undefined;
    for (var c in _.sortBy(register, (r) => r.priority)) {
        var item = register[c];

        //how many creeps required for this room
        var requiredCreeps = item.module.minRequired(room);

        //how many creeps do we have of this role in this room currently?
        var actualCreeps = _.size(getCreepsByRole(room, item.module.role));

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

        console.log(`next build in ${room.name}: ${next.module.role}`);

        const couriers = getCreepsByRole(room, "courier").length;
        const minCouriers = minCouriersRequired(room);

        const ratio = couriers == 0 ? 0 : minCouriers / couriers; //ratio the amount we consider 'full' extensions based on the amount of couriers we have working
        const extensionCapacity = energyCapacity(room, [STRUCTURE_EXTENSION]);
        const extensionCapacityRatioed = extensionCapacity * ratio;
        const extensionStored = energyStored(room, [STRUCTURE_EXTENSION]);
        const storedEnergy = energyStored(room);

        //are extensions full enough?
        if (extensionStored < extensionCapacityRatioed) {
            //if we have enough energy stored, and couriers to transfer it
            if (storedEnergy > extensionCapacityRatioed) {
                return; //wait
            }
        }

        return !next
            ? null
            : spawner.spawnCreep(room, next.module.role, next.sizeLimit);
    },
};
