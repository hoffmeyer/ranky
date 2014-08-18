'use strict';
var _ = require('underscore')._,
    models = require('../models/models.js');

module.exports = (function(){
    var players = {},
    eventBus;

    var newPlayer = function(event) {
        var newPlayer = models.createPlayer({name: event.playerName, initialScore: 1000});
        players[newPlayer.id] = newPlayer;
        return newPlayer;
    };

    var setScoresOnPlayers = function(scores) {
        _.each(scores, function(val, key) {
            if(val > 0) {
                players[key].addPoints(val);
            } else {
                players[key].subtractPoints(-val);
            }
        });
    };

    var idsToPlayers = function(ids) {
        return _.map(ids, function(playerId) {
            return players[playerId];
        });
    };

    var addMatch = function(event) {
        var team1Players = idsToPlayers(event.team1.players),
            team2Players = idsToPlayers(event.team2.players),
        scoringEvent = {
            type: 'scoreMatchEvent',
            team1: {
                players: team1Players,
                score: event.team1.score
            },
            team2: {
                players: team2Players,
                score: event.team2.score
            },
            callback: function(scores) {
                setScoresOnPlayers(scores);
                event.callback(scores);
            }
        };
        eventBus.post(scoringEvent);
    };

    return {
        setBus: function(bus) {
            eventBus = bus;
        },
        handle: function(event) {
            switch(event.type) {
                case 'createPlayerEvent':
                    event.callback(newPlayer(event));
                break;
                case 'registerMatchEvent':
                    event.callback(addMatch(event));
                break;
                case 'getListEvent':
                    event.callback(players);
                break;
                case 'getPlayerEvent':
                    event.callback(players[event.playerId]);
                break;
            }
        }
    };

})();
