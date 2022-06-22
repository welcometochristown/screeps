const manager = require("creep.manage");
const creepActioner = require("creep.action");
const structureActioner = require("structure.action");
const memory = require("util.memory");
const { allCreeps, findHostileCreeps } = require("./util.creep");

const isWall = (room, point) =>
    _.some(
        room.lookAt(room.getPositionAt(point.x, point.y)),
        (l) => l.terrain === "wall"
    ); //is there a wall at {point} in {room}

const findSourceLimit = (room, source) => {
    const topLeft = { x: source.pos.x - 1, y: source.pos.y - 1 };
    var limit = 0;

    for (let x = 0; x < 3; x++) {
        for (let y = 0; y < 3; y++) {
            if (x == 1 && y == 1) continue; //middle square

            //point around the source we want to go to
            let target = { x: topLeft.x + x, y: topLeft.y + y };
            let pos = room.getPositionAt(target.x, target.y);

            //the path to the point
            let path = Game.spawns["Spawn1"].pos.findPathTo(pos, {
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

const initSourceInfo = (room) => {
    if (!Memory.sourceInfo) {
        var sourceInfo = [];

        var sources = room.find(FIND_SOURCES);

        for (var s in sources) {
            var source = sources[s];
            sourceInfo.push({
                room,
                source,
                limit: findSourceLimit(room, source),
            });
        }

        Memory.sourceInfo = sourceInfo;
    }
};

const init = (room) => {
    initSourceInfo(room);
};

module.exports.loop = function () {
    //flush memory
    memory.flush();

    for (var name in Game.rooms) {
        const room = Game.rooms[name];

        init(room);

        //manager controls the creation and removal of screeps dependent on our current needs
        manager.run(room);

        //action all structures
        structureActioner.run(room);

        //creep actioner runs all the creeps, decides when actions needs to change
        creepActioner.run(room);
    }
    //console.log(_.map(Game.rooms, (n) => n.name));
    //const rooms = _.uniq(_.map(room.find(FIND_MY_CREEPS), (c) => c.room.name));

    // console.log(rooms);
    //get the room we are in
    //const room = Game.spawns["Spawn1"].room;
};
