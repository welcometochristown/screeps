const pickup = (creep) => {
    if (creep.memory.target) {
        var target = Game.getObjectById(creep.memory.target.id);
        if (creep.pickup(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creep.moveTo(target);
            return;
        }
    }

    //no targets to pickup
    creep.memory.action = undefined;
    creep.memory.target = undefined;
};

module.exports = {
    run: pickup,
    action: "pickup",
};
