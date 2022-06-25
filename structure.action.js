const { findObjectMemory, setObjectMemory } = require("util.memory");

//structure actions
const actions = {
    defend: require("action.defend"),
    link: require("action.link"),
};

const getByAction = (action) => _.filter(actions, (a) => a.action == action)[0];

const getActionByStructure = (structure) => {
    if (structure.structureType == STRUCTURE_TOWER) return "defend";
    if (structure.structureType == STRUCTURE_LINK) return "link";
    return undefined;
};

const action = (structure) => {
    //find the action function the creep currently has in memory
    const memory = findObjectMemory(structure);

    if (memory) {
        var action = getByAction(memory.action);

        if (action) {
            action.run(structure);
            return;
        }
    }

    //if an action was found do the action
    action = getActionByStructure(structure);

    console.log(`${structure.structureType} action is ${action}`);
    setObjectMemory(structure, { action, target: undefined });
};

module.exports = {
    run: (room) => {
        room.find(FIND_MY_STRUCTURES, {
            filter: (s) =>
                [STRUCTURE_TOWER, STRUCTURE_LINK].includes(s.structureType),
        }).forEach(action);
    },
};
