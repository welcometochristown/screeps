module.exports = {
    posToStr: (point) => `${point.x}, ${point.y}`,
    toArray: (hash) => {
        const ret = [];
        for (let i in hash) {
            ret.push(hash[i]);
        }
        return ret;
    },
    //if something is higher priority than the rest remove all others (first to last in priority)
    filterByPriority: (items, priorities, predicate) => {
        for (let i in priorities) {
            let priority = priorities[i];
            if (_.some(items, (item) => predicate(item) === priority)) {
                items = _.filter(items, (item) => predicate(item) === priority);
                break;
            }
        }
        return items;
    },
};
