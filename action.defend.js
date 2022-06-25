const { closest } = require("util.geography");

const defend = (structure) => {
    let enemyCreeps = structure.room.find(FIND_HOSTILE_CREEPS);
    let closestEnemy = closest(structure, enemyCreeps);

    if (closestEnemy) {
        structure.attack(closestEnemy);
    }
};

module.exports = {
    run: defend,
    action: "defend",
};
