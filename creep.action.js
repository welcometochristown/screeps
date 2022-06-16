const { getModuleByRole } = require("util.social");
const { getByAction } = require("util.actions");

const action = (creep) => {
    //find the action function the creep currently has in memory
    var action = getByAction(creep.memory.action);

    //if an action was found, broadcast what the creep is doing, then do the action
    if (action) {
        creep.say(
            `${creep.memory.action} ${
                creep.memory.target ? creep.memory.target.id : ""
            }`
        );
        action.run(creep);
    }
    //otherwise find the action the creep should be doing based on its role
    else {
        var module = getModuleByRole(creep.memory.role);
        creep.memory.action = module.getAction(creep);
    }
};

module.exports = {
    run: () => {
        for (var name in Game.creeps) {
            var creep = Game.creeps[name];
            action(creep);
        }
    },
};
