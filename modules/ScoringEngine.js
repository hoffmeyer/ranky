'use strict';
var _ = require('underscore')._;
module.exports = (function(){
    var eventBus;

    var scoreMatch = function(event) {
        var scores = {};
        var points = 25;
        if(event.team1.score > event.team2.score) {
            _.each(event.team1.players, function(elem) {scores[elem.id] = points;});
            _.each(event.team2.players, function(elem) {scores[elem.id] = -points;});
        } else if(event.team1.score < event.team2.score) {
            _.each(event.team1.players, function(elem) {scores[elem.id] = -points;});
            _.each(event.team2.players, function(elem) {scores[elem.id] = points;});
        } else {
            _.each(event.team1.players, function(elem) {scores[elem.id] = 0;});
            _.each(event.team2.players, function(elem) {scores[elem.id] = 0;});
        }
        event.callback(scores);
    };

    return {
        setBus: function(bus) {
            eventBus = bus;
        },
        handle: function(event) {
            switch(event.type) {
                case 'scoreMatchEvent':
                    scoreMatch(event);
                break;
            }
        }
    };

})();
