const { linkPair } = require("util.geography");

const link = (structure) => {
    const pair = linkPair(structure.room);

    //we are the closest to spawn, the reciever dont do anything
    if (!pair || pair.sender.id == structure.id) {
        return;
    }

    if (pair.sender.store[RESOURCE_ENERGY] > 0) {
        pair.sender.transferEnergy(pair.reciever);
    }
};

module.exports = {
    run: link,
    action: "link",
};
