const friends = [];
const isWorker = (creep) => _.some(creep.body, (part) => part.type === "work");

module.exports = {
    isWorker,
};
