const { cost, availableBuildEnergy } = require("util.calculate");
const { getModuleByRole } = require("util.social");
const { construct } = require("util.construction");

const makeName = (role) => role.substring(0, 1) + Game.time.toString(16);

module.exports = {
    spawnCreep: (room, role, prioritise) => {
        //how much energy do we have to build with?
        var available = availableBuildEnergy(room);

        //get the correct module by role
        var module = getModuleByRole(role);

        //construct body blueprint from module
        var body = construct(module.blueprint, available, prioritise);

        //dont have enough to create this body, then quit
        if (available < cost(body)) return;

        //find all spawns in our room
        var spawns = room.find(FIND_MY_STRUCTURES, {
            filter: { structureType: STRUCTURE_SPAWN },
        });

        for (var i in spawns) {
            //only spawn one creep at a time from each spawn
            if (spawns[i].spawning) continue;

            //spawn the new creep
            spawns[i].spawnCreep(body, makeName(role), {
                memory: { role: role },
            });

            break;
        }
    },
};
