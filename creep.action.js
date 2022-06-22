const { getModuleByRole } = require("util.social");

//creep actions
const actions = {
    harvest: require("action.harvest"),
    transfer: require("action.transfer"),
    upgrade: require("action.upgrade"),
    withdraw: require("action.withdraw"),
    repair: require("action.repair"),
    build: require("action.build"),
    suicide: require("action.suicide"),
    courier: require("action.courier"),
    pickup: require("action.pickup"),
    scout: require("action.scout"),
};

const getByAction = (action) => _.filter(actions, (a) => a.action == action)[0];

const action = (creep) => {
    //find the action function the creep currently has in memory
    const action = getByAction(creep.memory.action);

    //if an action was found, broadcast what the creep is doing, then do the action
    if (action) {
        // if (creep.memory.role == "builder") {
        //     creep.say(
        //         `${creep.memory.action} ${
        //             creep.memory.target ? creep.memory.target.id : ""
        //         }`
        //     );
        // }S

        action.run(creep);
    }
    //otherwise find the action the creep should be doing based on its role
    else {
        var module = getModuleByRole(creep.memory.role);
        creep.memory.action = module.getAction(creep);
    }
};

module.exports = {
    run: (room) => {
        room.find(FIND_MY_CREEPS).forEach(action);
    },
};
