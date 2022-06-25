const { closest } = require("util.geography");

const link = (structure) => {
    const allLinks = structure.room.find(FIND_MY_STRUCTURES, {
        filter: { structureType: STRUCTURE_LINK },
    });

    //only works with 2 links in the same room
    if (allLinks.length < 2) return;

    const spawns = structure.room.find(FIND_MY_STRUCTURES, {
        filter: { structureType: STRUCTURE_SPAWN },
    });

    if (!spawns) return;

    const closestLinkToSpawn = closest(spawns[0], allLinks);

    const reciever = _.find(allLinks, (link) => link.id == closestLinkToSpawn);
    const sender = _.find(allLinks, (link) => link.id != closestLinkToSpawn);

    //we are the closest to spawn, the reciever dont do anything
    if (sender.id == structure.id) return;

    if (sender.store[RESOURCE_ENERGY > 0]) sender.transferEnergy(reciever);
};

module.exports = {
    run: link,
    action: "link",
};
