const { filterByPriority } = require("util.common");

const closest = (object, targets) => {
    if (!targets) {
        console.log("no targets defined in closest function");
        return undefined;
    }
    if (targets.length == 0) return undefined;
    if (targets.length == 1) return targets[0];
    return _.sortBy(targets, (s) => object.pos.getRangeTo(s))[0];
};

const linkPair = (room) => {
    const links = room.find(FIND_MY_STRUCTURES, {
        filter: { structureType: STRUCTURE_LINK },
    });

    //only works with 2 links in the same room
    if (links.length < 2) return undefined;

    const sources = room.find(FIND_SOURCES);

    //todo change this to sender is closest one to source
    //we can only determine sender vs reciever by source distance
    if (!sources) return undefined;

    const mapping = _.flatten(
        sources.map((source) =>
            links.map((link) => ({
                link,
                source,
                distance: link.pos.getRangeTo(source),
            }))
        )
    );

    // mapping.forEach((map) =>
    //     console.log(`${map.link.id} -> ${map.source.id} = ${map.distance}`)
    // );

    mapping.sort(function (a, b) {
        return a.distance - b.distance;
    });

    const closestLinkToSource = mapping[0].link;

    // console.log(
    //     ` closest ${closestLinkToSource.link.id} -> ${closestLinkToSource.source.id} = ${closestLinkToSource.distance}`
    // );

    const reciever = _.find(links, (link) => link.id != closestLinkToSource.id);
    const sender = _.find(links, (link) => link.id == closestLinkToSource.id);

    return { reciever, sender };
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
    let limit = 0;

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

const closestEnergyStorage = (creep, priority = []) => {
    let pair = linkPair(creep.room);

    let energyStructures = getEnergyStructures(
        creep.room,
        (s) =>
            (s.structureType == STRUCTURE_CONTAINER ||
                s.structureType == STRUCTURE_STORAGE ||
                (pair && pair.reciever && pair.reciever.id == s.id)) &&
            s.store[RESOURCE_ENERGY] > 1
    );

    return closest(
        creep,
        filterByPriority(energyStructures, priority, (s) => s.structureType)
    );
};

const closestMineralTransfer = (creep) => {
    let storages = creep.room.find(FIND_MY_STRUCTURES, {
        filter: (structure) =>
            structure.structureType == STRUCTURE_STORAGE &&
            _.sum(minerals, (mineral) => structure.store[mineral]) /
                structure.store.getCapacity() <=
                0.5, //store if there is less than 50% of space used by minerals
    });

    return closest(creep, storages);
};

module.exports = {
    isWall,
    findSourceLimit,
    linkPair,
    closestEnergyStorage,
    closestMineralTransfer,
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
        let energyStructures = getEnergyStructures(
            creep.room,
            (s) => s.store.getFreeCapacity(RESOURCE_ENERGY) > 0
        );

        return closest(
            creep,
            filterByPriority(energyStructures, priority, (s) => s.structureType)
        );
    },

    //closest energy storage place to withdraw energy

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
