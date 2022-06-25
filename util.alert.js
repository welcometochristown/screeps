/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * let mod = require('util.action');
 * mod.thing == 'a thing'; // true
 */

module.exports = {
    verbose: function (creep, func) {
        const result_map = [
            ["OK", 0],
            ["NOT_OWNER", -1],
            ["NO_PATH", -2],
            ["NAME_EXISTS", -3],
            ["BUSY", -4],
            ["NOT_FOUND", -5],
            ["NOT_ENOUGH_ENERGY_OR_RESOURCES", -6],
            ["INV_TARGET", -7],
            ["FULL", -8],
            ["NOT_IN_RNG", -9],
            ["INV_ARG", -10],
            ["TIRED", -11],
            ["NO_BDYPRT", -12],
            ["NOT_ENOUGH_EXTENSIONS", -6],
            ["RCL_NOT_ENOUGH", -14],
            ["GCL_NOT_ENOUGH", -15],
        ];

        let code = func();
        if (code != OK) {
            let message = _.find(result_map, (i) => i[1] == code)[0];
            creep.say(message);
        }
    },
};
