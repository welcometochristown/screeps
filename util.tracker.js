
// const resetAt = 100;

// const trackPos = (pos) => {
//     //find the tracked position if its being tracked
//     var item = _.find(Memory.positionTracker, t => pos.EqualTo(t.pos));

//     if(!item){
//         Memory.positionTracker.push({
//             pos:pos,
//             times:0,
//         });
//     }
//     else {
//         item.times += 1;
//     }

// }

// module.exports = {
//     trackCreeps: function() {
//         if(!Memory.positionTrackerTicker || !Memory.positionTracker || Memory.positionTrackerTicker >= resetAt){
//             Memory.positionTrackerTicker = 0;
//             Memory.positionTracker = [];
//         } 
//         else {
//            Memory.positionTrackerTicker += 1;
//         }

//         for(var name in Game.creeps)
//         {
//             var creep = Game.creeps[name];
//             trackPos(creep.pos);
//         }
       
//     },
   
// }