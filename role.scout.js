const minRequired = (room) =>
    _.filter(Game.flags, (f) => f.name.toLowerCase() == "capture").length > 0
        ? 1
        : 0;
const getAction = (creep) => "scout";

module.exports = {
    role: "scout",
    getAction,
    minRequired,
    blueprint: [MOVE, CLAIM],
};
