const pickup = (creep, room) => {
    if (creep.memory.target) {
        creep.memory.target = Game.getObjectById(creep.memory.target.id);
        const result = creep.pickup(creep.memory.target, RESOURCE_ENERGY);
        if (result == ERR_NOT_IN_RANGE) {
            creep.moveTo(creep.memory.target);
            return;
        } else if (result != OK) {
            console.log(`${creep.name} pickup error : ${result}`);
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
