const suicide = (creep, room) => {
    //dont kill creeps with energy
    if (creep.store[RESOURCE_ENERGY] != 0) {
        creep.memory.action = "transfer";
        creep.memory.target = undefined;
        return;
    }
    creep.suicide();
};

module.exports = {
    run: suicide,
    action: "suicide",
};
