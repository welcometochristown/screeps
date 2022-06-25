const {
    closestEnergyTransfer,
    closestMineralTransfer,
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
    }

    if (!creep.memory.target) {
        //find the right transfer target based on resource
        creep.memory.target =
            resource == RESOURCE_ENERGY
                ? closestEnergyTransfer(creep)
                : closestMineralTransfer(creep);
    }

    if (creep.memory.target) {
        if (creep.transfer(creep.memory.target, resource) == ERR_NOT_IN_RANGE) {
            creep.moveTo(creep.memory.target);
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
