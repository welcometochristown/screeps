const { cost, parts } = require("util.calculate");

module.exports = {
    construct: (blueprint, energy, sizeLimit, prioritise) => {
        let body = [...blueprint];

        //basic body
        let basic_cost = cost(body);

        //how big can we make it with energy
        let size = _.floor(energy / basic_cost);

        //limit the amount of times we increase it based on sizeLimit
        if (sizeLimit > 0) {
            size = Math.min(sizeLimit, size);
        }

        //increase by size times
        for (let i = 1; i < size; i++) {
            body = body.concat([...blueprint]);
        }

        // console.log(
        //     `basic_cost = ${basic_cost}, energy = ${energy} size=${size}, body=${body}`
        // );

        // while (true) {
        //     let new_cost = cost(body);
        //     let remaining = energy - new_cost;

        //     //TODO : this always takes the first instance of 100 or 50 it should pop each one then reset
        //     let spare_parts = _.sortBy(
        //         _.filter(
        //             _.map(parts, (p, k) => ({ key: k, value: p })),
        //             (n) =>
        //                 blueprint.includes(n.key.toLowerCase()) &&
        //                 n.value < remaining
        //         ),
        //         (m) => -m.value
        //     );

        //     if (spare_parts.length == 0) {
        //         break;
        //     }

        //     body = body.concat(spare_parts[0].key.toLowerCase());
        // }

        return body;
    },
};
