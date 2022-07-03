const manager = require("creep.manage");
const creepActioner = require("creep.action");
const structureActioner = require("structure.action");
const memory = require("util.memory");

const HOME_ROOM = "W56N33";

module.exports.loop = function () {
    //flush memory
    memory.flush();
    memory.init();

    for (let name in Game.rooms) {
        const room = Game.rooms[name];

        //manager controls the creation and removal of screeps dependent on our current needs
        manager.run(room);

        //action all structures
        structureActioner.run(room);

        //action all creeps
        creepActioner.run(room);
    }
};
