const pickup = (creep, room) => {
    if (creep.memory.target) {
        var target = Game.getObjectById(creep.memory.target.id);
        const result = creep.pickup(target, RESOURCE_ENERGY);
        if (result == ERR_NOT_IN_RANGE) {
            creep.moveTo(target);
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
