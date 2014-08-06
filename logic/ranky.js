'use strict';
var _ = require('underscore')._,
    validator = require('../logic/validator.js'),
    db = require('monk')('localhost/ranky'),
    dbEvent = db.get('events'),
    eventBus = require('../logic/eventBus.js'),
    rankListModule = require('../modules/RankList.js'),
    scoringEngineModule = require('../modules/ScoringEngine.js');

module.exports = (function(){

    var players = {};

    var storeEvent = function(event) {
        dbEvent.insert(event);
        return true;
    };


    eventBus.register(rankListModule);
    eventBus.register(scoringEngineModule);

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
        },
        getPlayers: function() {
            var convert = function(val) {
                return val.toJSON();
            };
            var sort = function(val) {
                return - val.points;
            };
            return _.chain(players).map(convert).sortBy(sort).value();
        },
        getPlayer: function(id) {
            if(players.hasOwnProperty(id)){
                return players[id];
            } else {
                throw {
                    message: 'Unknown player id',
                    name: 'InvalidPlayerIdException'
                };
            }
        }
    };
})();
