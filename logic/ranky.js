'use strict';
var validator = require('../logic/validator.js'),
    db = require('monk')('localhost/ranky'),
    dbEvent = db.get('events'),
    eventBus = require('../logic/eventBus.js')(),
    rankListModule = require('../modules/RankList.js')(),
    scoringEngineModule = require('../modules/ScoringEngine.js'),
    broadcastModule = require('../modules/broadcaster.js');

module.exports = function(io){
    var storeEvent = function(event) {
        dbEvent.insert(event);
        return true;
    };

    eventBus.register(rankListModule);
    eventBus.register(scoringEngineModule);
    broadcastModule.setWebsocket(io); // TODO: this must be done in a nicer way
    eventBus.register(broadcastModule);

    return {
        validateEvent: function(event) {
            return validator.validateEvent(event);
        },
        handleEvent: function(event, isStorable) {
            if(isStorable){
                storeEvent(event);
            }
            if(!event.callback){
                event.callback = function() {}; // add default callback if not defined
            }
            eventBus.post(event);
        }
    };
};
