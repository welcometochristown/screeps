const { closestEnergyTransfer } = require("util.geography");
const { getModuleByRole } = require("./util.social");

const transfer = (creep, room) => {
    //transfer complete, ready for new action
    if (creep.carry.energy == 0) {
        creep.memory.action = undefined;
        creep.memory.target = undefined;
        return;
    }

    var target = undefined;

    if (!creep.memory.target) {
        //find the closeset {resource} transfer location
        target = closestEnergyTransfer(creep);
    } else {
        target = Game.getObjectById(creep.memory.target.id);
    }

    if (target) {
        const result = creep.transfer(target, RESOURCE_ENERGY);
        if (result == ERR_NOT_IN_RANGE) {
            creep.moveTo(target);
            return;
        } else if (result != OK) {
            //console.log(`${creep.name} transfer error : ${result}`);
        }
    }

    //no targets to transfer to
    creep.memory.action = undefined;
    creep.memory.target = undefined;
};

module.exports = {
    run: transfer,
    action: "transfer",
};
