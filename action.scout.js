const scout = (creep) => {
    creep.suicide();
    const room = "W55N33";

    if (room) {
        if (creep.room.name != room) {
            creep.moveTo(new RoomPosition(5, 35, room), { maxOps: 500 });
        } else {
            const controller = creep.room.find(FIND_STRUCTURES, {
                filter: { structureType: STRUCTURE_CONTROLLER },
            })[0];

            if (controller.owner.username != "thunderbeans") {
                if (creep.claimController(controller) == ERR_NOT_IN_RANGE) {
                    console.log("moving to room controller");
                    creep.moveTo(controller);
                }
            }
        }
    }
};

module.exports = {
    run: scout,
    action: "scout",
};
