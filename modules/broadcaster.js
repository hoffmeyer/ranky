var _ = require('underscore')._;

module.exports = function(bus, io){
    'use strict';

    var broadcast = function(type, message) {
        io.emit(type, message);
    };

    bus.listen('playersUpdated', function(event){
        if(!event.noBroadcast) {
            broadcast('playersUpdated',
                _.map(event.players, function(player) { 
                    return player.toJSON(); 
                })
            );
        }
    });

    bus.listen('playerCreated', function(event){
        if(!event.noBroadcast) {
            broadcast('playerCreated', event.player.toJSON());
        }
    });
};
