const { closest } = require("util.geography");

const defend = (structure) => {
    var enemyCreeps = structure.room.find(FIND_HOSTILE_CREEPS);
    var closestEnemy = closest(structure, enemyCreeps);

    if (closestEnemy) {
        structure.attack(closestEnemy);
    }
};

module.exports = {
    run: defend,
    action: "defend",
};
