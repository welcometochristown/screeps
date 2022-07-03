const getAction = (creep) => {
    if (creep.store.getFreeCapacity() === 0) {
        return "transfer";
    }
    return "harvest";
};

const getRequired = (room) => {
    const roomInfo = _.find(Memory.rooms, (r) => r.room.name === room.name);
    return _.sum(roomInfo.sources, (source) => source.limit);
};

module.exports = {
    role: "harvester",
    getAction,
    getRequired,
    blueprint: [MOVE, CARRY, WORK],
};
