var _ = require('underscore')._,
    models = require('../models/models.js');

module.exports = function(bus){
'use strict';
    var players = {};

    var newPlayer = function(event) {
        var newPlayer = models.createPlayer({name: event.playerName, initialScore: 1000});
        players[newPlayer.id] = newPlayer;
        bus.post('playerCreated', {
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
                bus.post('playersUpdated', {
                    noBroadcast: event.noBroadcast,
                    players: _.map(scores, function(val, key){ return players[key];})
                });
                event.callback(scores);
            }
        };
        bus.post('scoreMatch', scoringEvent);
    };

    var getSortedList = function() {
        // convert to array
        var playerArray = Object.keys(players).map(function(id){return players[id];}); 
        // sort descending
        return _.sortBy(playerArray, function(player){return -player.getPoints();});
    };

    bus.listen('createPlayer', function(event){
        event.callback(newPlayer(event));
    });
    bus.listen('registerMatch', function(event) {
        addMatch(event);
    });
    bus.listen('getList', function(event) {
        event.callback(getSortedList());
    });
    bus.listen('getPlayer', function(event) {
        event.callback(players[event.playerId]);
    });
};
