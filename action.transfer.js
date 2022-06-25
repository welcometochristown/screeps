const {
    closestEnergyTransfer,
    closestMineralTransfer,
    linkPair,
    closest,
} = require("util.geography");
const { getModuleByRole } = require("./util.social");
const { minerals } = require("util.resource");

const transfer = (creep, room) => {
    //transfer complete, ready for new action
    if (creep.store.getUsedCapacity() == 0) {
        creep.memory.action = undefined;
        creep.memory.target = undefined;
        return;
    }

    //get a resource the creep is carrying
    const resource = _.find(
        [RESOURCE_ENERGY, ...minerals],
        (resource) => creep.store[resource] > 0
    );

    if (creep.memory.target) {
        creep.memory.target = Game.getObjectById(creep.memory.target.id);
    } else {
        //find the right transfer target based on resource
        creep.memory.target =
            resource == RESOURCE_ENERGY
                ? closestEnergyTransfer(creep)
                : closestMineralTransfer(creep);

        if (creep.memory.target) {
            //todo this doesnt work currently
            // //if we are transferring energy, lets see if the link sender is closer
            if (resource == RESOURCE_ENERGY) {
                const pair = linkPair(room);

                if (pair) {
                    creep.memory.target = closest(creep, [
                        creep.memory.target,
                        pair.sender,
                    ]);
                }
            }
        }
    }

    if (
        creep.memory.target &&
        creep.memory.target.store.getFreeCapacity() == 0
    ) {
        creep.memory.target = undefined;
    }

    if (creep.memory.target) {
        switch (creep.transfer(creep.memory.target, resource)) {
            case ERR_NOT_IN_RANGE:
                creep.moveTo(creep.memory.target);
                break;
            case ERR_FULL:
                creep.memory.target = undefined;
                break;
        }
        return;
    }

    //no targets to transfer to
    creep.memory.action = undefined;
    creep.memory.target = undefined;
};

module.exports = {
    run: transfer,
    action: "transfer",
};
