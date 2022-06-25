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
    let action = undefined;

    if (memory) {
        action = getByAction(memory.action);

        if (action) {
            //continnue doing action until the action in memory is unset
            action.run(structure);
            return;
        }
    }

    action = getActionByStructure(structure);
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
