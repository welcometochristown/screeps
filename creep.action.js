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
    // if (creep.memory.role == "miner") {
    //     creep.memory.action = undefined;
    //     creep.memory.target = undefined;
    // }

    //find the action function the creep currently has in memory
    const action = getByAction(creep.memory.action);

    //if an action was found, broadcast what the creep is doing, then do the action
    if (action) {
        // if (creep.memory.role == "courier") {
        //     const message = `${creep.memory.action} ${
        //         creep.memory.target ? creep.memory.target.id : ""
        //     }`;

        //     //creep.say(message);
        //     //  console.log(message);
        // }

        //creeps should only work in the room they were spawned in
        const room = Game.rooms[creep.memory.spawnRoom];

        action.run(creep, room);
    }
    //otherwise find the action the creep should be doing based on its role
    else {
        let module = getModuleByRole(creep.memory.role);
        creep.memory.action = module.getAction(creep);
    }

    //say hello lol
    // if (
    //     creep.room.find(FIND_MY_CREEPS, {
    //         filter: (c) =>
    //             creep.room.findPath(creep.pos, c.pos, { maxOps: 10 }).length ==
    //             1,
    //     }).length
    // ) {
    //     creep.say("✋");
    // }
};

module.exports = {
    run: (room) => {
        room.find(FIND_MY_CREEPS).forEach(action);
    },
};
