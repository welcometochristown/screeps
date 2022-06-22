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
    targetedAt: (object) => {
        var creeps = _.forEach(Game.creeps, (name) => Game.creeps[name]);
        return _.filter(
            creeps,
            (creep) =>
                creep.memory.target && creep.memory.target.id == object.id
        );
    },
    harvesters: () => {
        var creeps = _.forEach(Game.creeps, (name) => Game.creeps[name]);
        return _.filter(creeps, (creep) => creep.memory.role == "harvester");
    },
    roles: () => {
        return _.map(modules, (m) => m.role);
    },
    getCreepsByRole: (role) => {
        return _.filter(Game.creeps, (c) => c.memory.role == role);
    },
    getModuleByRole: (role) => {
        return _.filter(modules, (m) => m.role == role)[0];
    },
    getCreepRole: (creep) => {
        return creep.memory.role;
    },
    modules: modules,
};
