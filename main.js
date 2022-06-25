const manager = require("creep.manage");
const creepActioner = require("creep.action");
const structureActioner = require("structure.action");
const memory = require("util.memory");

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

        //creep actioner runs all the creeps, decides when actions needs to change
        creepActioner.run(room);
    }
};
