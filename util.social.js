const modules = {
    harvester: require("role.harvester"),
    upgrader: require("role.upgrader"),
    builder: require("role.builder"),
    repairer: require("role.repairer"),
    courier: require("role.courier"),
    scout: require("role.scout"),
    miner: require("role.miner"),
};

module.exports = {
    //return all creeps that are targeting this structure
    targetedAt: (object) =>
        _.filter(
            Game.creeps,
            (creep) =>
                creep.memory.target && creep.memory.target.id == object.id
        ),
    roles: () => {
        return _.map(modules, (m) => m.role);
    },
    //find creeps by the room they were spawned in
    getCreepsByRole: (spawnRoom, role) =>
        _.filter(
            Game.creeps,
            (creep) =>
                creep.owner.username == "thunderbeans" &&
                creep.memory.role == role &&
                creep.memory.spawnRoom == spawnRoom.name
        ),
    //find creeps by the room they are in now
    getCreepsByRoleInRoom: (room, role) =>
        room.find(FIND_MY_CREEPS, {
            filter: (creep) => creep.memory.role == role,
        }),

    getModuleByRole: (role) => {
        return _.filter(modules, (m) => m.role == role)[0];
    },
    getCreepRole: (creep) => {
        return creep.memory.role;
    },
    modules: modules,
};
