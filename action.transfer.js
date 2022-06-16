const { closestEnergyTransfer } = require("util.geography");
const { getModuleByRole } = require("./util.social");

const transfer = (creep) => {
    //transfer complete, ready for new action
    if (creep.carry.energy == 0) {
        creep.memory.action = undefined;
        creep.memory.target = undefined;
        return;
    }

    creep.memory.target = closestEnergyTransfer(creep);

    if (creep.memory.target) {
        if (
            creep.transfer(creep.memory.target, RESOURCE_ENERGY) ==
            ERR_NOT_IN_RANGE
        ) {
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
