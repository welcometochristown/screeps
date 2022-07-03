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
    miner: require("action.mine"),
    wait: require("action.wait"),
};

const getByAction = (action) => _.filter(actions, (a) => a.action == action)[0];

const action = (creep) => {
    //find the action function the creep currently has in memory
    const action = getByAction(creep.memory.action);

    //load target object
    if (creep.memory.target) {
        creep.memory.target = Game.getObjectById(creep.memory.target.id);
    }

    //if an action was found do the action
    if (action) {
        action.run(creep, Game.rooms[creep.memory.spawnRoom]);
    }
    //otherwise find the action the creep should be doing based on its role
    else {
        const module = getModuleByRole(creep.memory.role);
        creep.memory.action = module.getAction(creep);
    }
};

module.exports = {
    run: (room) => {
        room.find(FIND_MY_CREEPS).forEach(action);
    },
};
