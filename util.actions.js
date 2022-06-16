const actions = {
    harvest: require("action.harvest"),
    transfer: require("action.transfer"),
    upgrade: require("action.upgrade"),
    withdraw: require("action.withdraw"),
    repair: require("action.repair"),
    build: require("action.build"),
    suicide: require("action.suicide"),
};

module.exports = {
    actions: actions,
    getByAction: (action) => _.filter(actions, (a) => a.action == action)[0],
};
