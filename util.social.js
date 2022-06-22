const modules = {
    harvester: require("role.harvester"),
    upgrader: require("role.upgrader"),
    builder: require("role.builder"),
    repairer: require("role.repairer"),
    courier: require("role.courier"),
    scout: require("role.scout"),
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
    getCreepsByRole: (room, role) =>
        room.find(FIND_MY_CREEPS, { filter: (c) => c.memory.role == role }),
    getModuleByRole: (role) => {
        return _.filter(modules, (m) => m.role == role)[0];
    },
    getCreepRole: (creep) => {
        return creep.memory.role;
    },
    modules: modules,
};
