const pickup = (creep, room) => {
    if (creep.memory.target && creep.memory.target.amount > 0) {
        if (creep.pickup(creep.memory.target, creep.memory.target.resourceType) == ERR_NOT_IN_RANGE) {
            creep.moveTo(creep.memory.target);
        }
        return;
    }

    //no longer want to pickup this target
    creep.memory.action = undefined;
    creep.memory.target = undefined;
};

module.exports = {
    run: pickup,
    action: "pickup",
};
