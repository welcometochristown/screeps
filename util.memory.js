const { findSourceLimit } = require("./util.geography");

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

const initRoomMemory = () => {
    if (Memory.rooms) return;

    Memory.rooms = [];

    for (var roomName in Game.rooms) {
        let room = Game.rooms[roomName];
        Memory.rooms.push({ room, sources: [] });

        room.find(FIND_SOURCES).forEach((source) => {
            Memory.rooms[Memory.rooms.length - 1].sources.push({
                source,
                limit: findSourceLimit(room, source),
            });
        });
    }
};

const init = () => {
    initRoomMemory();
};

module.exports = {
    flush: () => {
        flushCreeps();
    },
    findObjectMemory,
    setObjectMemory,
    init,
};
