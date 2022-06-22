const { cost, parts } = require("util.calculate");

module.exports = {
    construct: (blueprint, energy, sizeLimit, prioritise) => {
        var body = [...blueprint];

        //basic body
        var basic_cost = cost(body);

        //how big can we make it with energy
        var size = _.floor(energy / basic_cost);

        if (sizeLimit > 0) {
            size = Math.min(sizeLimit, size);
        }

        //increase by size times
        for (var i = 1; i < size; i++) {
            body = body.concat([...blueprint]);
        }

        while (true) {
            var new_cost = cost(body);
            var remaining = energy - new_cost;

            //TODO : this always takes the first instance of 100 or 50 it should pop each one then reset
            var spare_parts = _.sortBy(
                _.filter(
                    _.map(parts, (p, k) => ({ key: k, value: p })),
                    (n) =>
                        blueprint.includes(n.key.toLowerCase()) &&
                        n.value < remaining
                ),
                (m) => -m.value
            );

            if (spare_parts.length == 0) {
                break;
            }

            body = body.concat(spare_parts[0].key.toLowerCase());
        }
        return body;
    },
};
