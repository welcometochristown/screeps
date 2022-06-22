const minRequired = (room) => 1;
const getAction = (creep) => "scout";

module.exports = {
    role: "scout",
    getAction,
    minRequired,
    blueprint: [MOVE, CLAIM],
};
