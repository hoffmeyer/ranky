'use strict';
var _ = require('underscore')._;

module.exports = (function(){
    var eventBus,
        io;

    var broadcast = function(message) {
        io.emit(message);
    };

    return {
        setBus: function(bus){
            eventBus = bus;
        },
        setWebsocket: function(io) {
            this.io = io;
        },
        handle: function(event){
            switch(event.type){
                case 'playersUpdatedEvent':
                    if(!event.noBroadcast) {
                        broadcast(
                            _.map(event.players, 
                            function(player) { 
                                return player.toJSON(); 
                            }
                        ));
                    }
                break;
            }
        }
    };
})();
