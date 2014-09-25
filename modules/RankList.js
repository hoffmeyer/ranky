var _ = require('underscore')._,
    models = require('../models/models.js');

module.exports = function(){
'use strict';
    var players = {},
    eventBus;

    var newPlayer = function(event) {
        var newPlayer = models.createPlayer({name: event.playerName, initialScore: 1000});
        players[newPlayer.id] = newPlayer;
        eventBus.post({
            type: 'playerCreatedEvent',
            noBroadcast: event.noBroadcast,
            player: newPlayer
        });
        return newPlayer;
    };

    var setScoresOnPlayers = function(scores) {
        _.each(scores, function(val, key) {
            if(val < 0) {
                players[key].subtractPoints(-val);
            } else {
                players[key].addPoints(val);
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
                eventBus.post({
                    type: 'playersUpdatedEvent',
                    noBroadcast: event.noBroadcast,
                    players: _.map(scores, function(val, key){ return players[key];})
                });
                event.callback(scores);
            }
        };
        eventBus.post(scoringEvent);
    };

    var getSortedList = function() {
        // convert to array
        var playerArray = Object.keys(players).map(function(id){return players[id];}); 
        // sort descending
        return _.sortBy(playerArray, function(player){return -player.getPoints();});
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
                    addMatch(event);
                break;
                case 'getListEvent':
                    event.callback(getSortedList());
                break;
                case 'getPlayerEvent':
                    event.callback(players[event.playerId]);
                break;
            }
        }
    };
};
