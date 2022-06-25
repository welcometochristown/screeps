const friends = [];
const isWorker = (creep) => _.some(creep.body, (part) => part.type === "work");

module.exports = {
    isWorker,
    //return all creeps that are targeting this structure
    targetedAt: (object) =>
        _.filter(
            Game.creeps,
            (creep) =>
                creep.memory.target && creep.memory.target.id == object.id
        ),
};
