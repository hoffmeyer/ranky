var validator = require('../logic/validator.js'),
    db = require('monk')('localhost/ranky'),
    dbEvent = db.get('events'),
    eventBus = require('../logic/eventBus.js')(),
    rankListModule = require('../modules/RankList.js'),
    scoringEngineModule = require('../modules/ScoringEngine.js'),
    broadcastModule = require('../modules/broadcaster.js');

module.exports = function(io){
'use strict';
    var storeEvent = function(event) {
        dbEvent.insert(event);
        return true;
    };

    // setup modules
    rankListModule(eventBus);
    scoringEngineModule(eventBus);
    broadcastModule(eventBus, io);

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
            eventBus.post(event.type, event);
        }
    };
};
