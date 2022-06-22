const flushCreeps = () => {
    for (var i in Memory.creeps) {
        if (!Game.creeps[i]) {
            delete Memory.creeps[i];
        }
    }
};

const findObjectMemory = (object) => {
    if (!Memory.objectMemory) return undefined;
    return Memory.objectMemory.find((m) => m.id == object.id);
};

const setObjectMemory = (object, memory) => {
    if (!Memory.objectMemory) {
        Memory.objectMemory = [];
    }

    const index = Memory.objectMemory.findIndex((m) => m.id == object.id);

    memory = { id: object.id, ...memory };

    if (index > -1) {
        Memory.objectMemory[index] = memory;
    } else {
        Memory.objectMemory.push(memory);
    }
};

module.exports = {
    flush: () => {
        flushCreeps();
    },
    findObjectMemory,
    setObjectMemory,
};
