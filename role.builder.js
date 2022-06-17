const roadCount = (sites) =>
    Math.ceil(_.filter(sites, (s) => s.structureType == STRUCTURE_ROAD).length);

const nonRoadCount = (sites) =>
    Math.ceil(_.filter(sites, (s) => s.structureType != STRUCTURE_ROAD).length);

const getAction = (creep) => {
    if (creep.room.find(FIND_MY_CONSTRUCTION_SITES).length) {
        return "build";
    }
    if (creep.carry.energy > 0) {
        return "transfer";
    }
    return "suicide";
};

const minRequired = (room, sites = room.find(FIND_MY_CONSTRUCTION_SITES)) =>
    Math.ceil((roadCount(sites) / 10 + nonRoadCount(sites)) / 10);

module.exports = {
    role: "builder",
    getAction,
    minRequired,
    blueprint: [MOVE, CARRY, WORK],
};

// const { closest, closestEnergyStorage } = require('util.geography');
// const { spawnCreep } = require('creep.spawn');

// const basic = [MOVE, CARRY, WORK];
// const role = 'builder';

// const repair = (creep) => {
//     creep.say('repair');

//     const targets = creep.room.find(FIND_STRUCTURES, {
//         filter: object => object.hits < object.hitsMax && object.structureType != STRUCTURE_WALL
//     });

//     var target = closest(creep, targets);

//     if(target != null) {
//         if(creep.repair(target) == ERR_NOT_IN_RANGE) {
//             creep.moveTo(target);
//         }
//     }

//     if(creep.carry.energy == 0){
//          creep.memory.action = 'withdraw';
//     }
// };

// const build = (creep) => {
//      creep.say('build');

//     var site = closest(creep, creep.room.find(FIND_MY_CONSTRUCTION_SITES));

//     if(!site)
//         return repair(creep);

//     var result = creep.build(site);

//     if(result != OK) {
//        creep.moveTo(site);
//     }

//     //upgrade complete, ready for new action
//      if(creep.carry.energy == 0){
//          creep.memory.action = 'withdraw';
//     }
// };

// const withdraw = (creep, spawnName)  =>  {
//     creep.say('withdraw');

//     var closestStorage = closestEnergyStorage(creep);

//     if(creep.withdraw(closestStorage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
//             creep.moveTo(closestStorage);
//     }

//     //transfer complete, ready for new action
//     if(creep.carry.energy == creep.carryCapacity){
//          creep.memory.action = 'build';
//     }
// };

// const action = (creep, spawnName) => {
//     switch(creep.memory.action){
//         case 'withdraw': return withdraw(creep, spawnName);
//         case 'build' :
//         default        : build(creep);
//     }
// }

//  module.exports = {
// //     run: function(creep, spawnName) {
// //           action(creep, spawnName);
// //     },

// //     spawn: function (spawnName, body = basic) {
// //         spawnCreep(spawnName, role, body);
// //     },

// //     role: role
//  };
