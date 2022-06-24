const scout = (creep, room) => {
    const flag = _.filter(
        Game.flags,
        (f) => f.name.toLowerCase() == "capture"
    )[0];

    if (flag) {
        if (!flag.room || creep.room.name != flag.room.name) {
            creep.moveTo(flag, {
                maxOps: 500,
            });
        } else {
            const controller = creep.room.find(FIND_STRUCTURES, {
                filter: { structureType: STRUCTURE_CONTROLLER },
            })[0];

            if (!controller) return;

            if (
                !controller.owner ||
                controller.owner.username != "thunderbeans"
            ) {
                if (creep.claimController(controller) == ERR_NOT_IN_RANGE) {
                    console.log("moving to room controller");
                    creep.moveTo(controller);
                }
            }

            if (
                controller.owner &&
                controller.owner.username == "thunderbeans"
            ) {
                flag.remove();
            }
        }
    }
};

module.exports = {
    run: scout,
    action: "scout",
};
