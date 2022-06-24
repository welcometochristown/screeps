const { filterByPriority } = require("util.common");

const closest = (object, targets) => {
    if (!targets) return undefined;
    if (targets.length == 0) return undefined;
    if (targets.length == 1) return targets[0];
    return _.sortBy(targets, (s) => object.pos.getRangeTo(s))[0];
};

const getEnergyStructures = (room, filter) => {
    const myEnergyStructures = room.find(FIND_MY_STRUCTURES, {
        filter: (structure) =>
            [
                STRUCTURE_SPAWN,
                STRUCTURE_EXTENSION,
                STRUCTURE_CONTAINER,
                STRUCTURE_STORAGE,
            ].includes(structure.structureType),
    });

    const otherEnergyStructures = room.find(FIND_STRUCTURES, {
        filter: (structure) =>
            [STRUCTURE_CONTAINER].includes(structure.structureType),
    });

    return _.filter([...myEnergyStructures, ...otherEnergyStructures], (s) =>
        filter(s)
    );
};

const isWall = (room, point) =>
    _.some(
        room.lookAt(room.getPositionAt(point.x, point.y)),
        (l) => l.terrain === "wall"
    ); //is there a wall at {point} in {room}

//find how many creeps can work a source
const findSourceLimit = (room, source) => {
    const topLeft = { x: source.pos.x - 1, y: source.pos.y - 1 };
    var limit = 0;

    for (let x = 0; x < 3; x++) {
        for (let y = 0; y < 3; y++) {
            if (x == 1 && y == 1) continue; //middle square

            //point around the source we want to go to
            let target = { x: topLeft.x + x, y: topLeft.y + y };
            let pos = room.getPositionAt(target.x, target.y);

            let startPoint = room.find(FIND_MY_STRUCTURES, {
                filter: { structureType: STRUCTURE_SPAWN },
            })[0]; // use any exit as

            if (!startPoint) return undefined; //we can only work this out if we have a spawn in the room we can use as a point of reference

            //the path to the point
            let path = startPoint.pos.findPathTo(pos, {
                maxOps: 500,
            });

            let lastPoint = path[path.length - 1];

            //last point ends at the target
            if (lastPoint.x === target.x && lastPoint.y === target.y) {
                //there are no wall terrain to pass through
                if (!_.some(path, (p) => isWall(room, p))) {
                    limit++;
                }
            }
        }
    }

    return limit;
};

module.exports = {
    isWall,
    findSourceLimit,
    closestMineralTransfer: (creep) => {
        var storages = creep.room.find(FIND_MY_STRUCTURES, {
            filter: (structure) =>
                structure.structureType == STRUCTURE_STORAGE &&
                _.sum(minerals, (mineral) => structure.store[mineral]) /
                    structure.store.getCapacity() <=
                    0.5, //store if there is less than 50% of space used by minerals
        });

        return closest(creep, storages);
    },
    //closest place to transfer energy to that has availability
    closestEnergyTransfer: (
        creep,
        priority = [
            STRUCTURE_SPAWN,
            STRUCTURE_EXTENSION,
            STRUCTURE_CONTAINER,
            STRUCTURE_STORAGE,
        ]
    ) => {
        var energyStructures = getEnergyStructures(
            creep.room,
            (s) => s.store.getFreeCapacity(RESOURCE_ENERGY) > 0
        );

        return closest(
            creep,
            filterByPriority(energyStructures, priority, (s) => s.structureType)
        );
    },

    //closest energy storage place to withdraw energy
    closestEnergyStorage: (creep, priority = []) => {
        var energyStructures = getEnergyStructures(
            creep.room,
            (s) =>
                (s.structureType == STRUCTURE_CONTAINER ||
                    s.structureType == STRUCTURE_STORAGE) &&
                s.store[RESOURCE_ENERGY] > 1
        );

        return closest(
            creep,
            filterByPriority(energyStructures, priority, (s) => s.structureType)
        );
    },
    //construction sites in same room as creep, or spawns to be constructed in other rooms
    allConstructionSites: (room) =>
        _.flatten(
            _.map(Game.rooms, (r) =>
                !room || room.name == r.name
                    ? r.find(FIND_MY_CONSTRUCTION_SITES)
                    : r.find(FIND_MY_CONSTRUCTION_SITES, {
                          filter: { structureType: STRUCTURE_SPAWN },
                      })
            )
        ),
    closest,
};
