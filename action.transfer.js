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
    var target = undefined;

    if (creep.memory.target) {
        target = Game.getObjectById(creep.memory.target.id);
    } else {
        //find the right transfer target based on resource
        target =
            resource == RESOURCE_ENERGY
                ? closestEnergyTransfer(creep)
                : closestMineralTransfer(creep);
    }

    if (target) {
        const result = creep.transfer(target, resource);
        if (result == ERR_NOT_IN_RANGE) {
            creep.moveTo(target);
            return;
        } else if (result != OK) {
            //console.log(`${creep.name} transfer error : ${result}`);
        }
    }

    // if(creep.store.)

    // if (creep.store[RESOURCE_ENERGY] > 0) {
    //     var target = undefined;

    //     if (!creep.memory.target) {
    //         //find the closeset {resource} transfer location
    //         target = closestEnergyTransfer(creep);
    //     } else {
    //         target = Game.getObjectById(creep.memory.target.id);
    //     }

    //     if (target) {
    //         const result = creep.transfer(target, resource);
    //         if (result == ERR_NOT_IN_RANGE) {
    //             creep.moveTo(target);
    //             return;
    //         } else if (result != OK) {
    //             //console.log(`${creep.name} transfer error : ${result}`);
    //         }
    //     }
    // }

    // minerals.forEach((mineral) => {
    //     if (!creep.store[mineral]) return;

    //     // var target = undefined;

    //     // if (!creep.memory.target) {
    //     //     //find the closeset {resource} transfer location
    //     //     target = closestEnergyTransfer(creep);
    //     // } else {
    //     //     target = Game.getObjectById(creep.memory.target.id);
    //     // }

    //     // if (target) {
    //     //     const result = creep.transfer(target, resource);
    //     //     if (result == ERR_NOT_IN_RANGE) {
    //     //         creep.moveTo(target);
    //     //         return;
    //     //     } else if (result != OK) {
    //     //         //console.log(`${creep.name} transfer error : ${result}`);
    //     //     }
    //     // }
    // });

    //no targets to transfer to
    creep.memory.action = undefined;
    creep.memory.target = undefined;
};

module.exports = {
    run: transfer,
    action: "transfer",
};
