const { cost, availableBuildEnergy } = require("util.calculate");
const { getModuleByRole } = require("util.social");
const { construct } = require("util.construction");

const makeName = (role) => role.substring(0, 1) + Game.time.toString(16);

module.exports = {
    spawnCreep: (room, role, sizeLimit, prioritise) => {
        //how much energy do we have to build with?
        let available = availableBuildEnergy(room);

        //get the correct module by role
        let module = getModuleByRole(role);

        //construct body blueprint from module
        let body = construct(
            module.blueprint,
            available,
            sizeLimit,
            prioritise
        );

        //dont have enough to create this body, then quit
        if (available < cost(body)) {
            // console.log("not enough energy");
            return;
        }

        console.log(`spawning ${role} in ${room.name}`);

        //find all spawns in our room
        let spawns = room.find(FIND_MY_STRUCTURES, {
            filter: { structureType: STRUCTURE_SPAWN },
        });

        for (let i in spawns) {
            //only spawn one creep at a time from each spawn
            if (spawns[i].spawning) continue;

            //spawn the new creep
            spawns[i].spawnCreep(body, makeName(role), {
                memory: { role: role, spawnRoom: room.name },
            });

            break;
        }
    },
};
