var events = require('../events/events.js'),
    eden = require('node-eden');


module.exports = function(bus){
    'use strict';
    var getRandom = function(num){
        return Math.floor((Math.random() * num) + 1)
    };

    var getRandomMatch = function(numPlayers){
        var player1 = getRandom(numPlayers),
            player2 = getRandom(numPlayers),
            score1 = getRandom(11) - 1,
            score2 = getRandom(11) - 1;
        return events.registerMatch([player1], score1, [player2], score2);
    };

    bus.listen('generateTestPlayers', function(event){
        var newEvent;
        for(var i = 1; i <= event.numPlayers; i++){
            newEvent = events.createPlayer(eden.adam());
            newEvent.noBroadcast = i+1 !== event.numPlayers; // only broadcast the last one
            bus.post('createPlayer', newEvent);
        }
        event.deferred.resolve();
    });

    bus.listen('generateTestMatches', function(event){
        var newEvent;
        bus.post('getList', {type: 'getList'}).then(function(list){
            for(var j = 0; j < event.numMatches; j++){
                newEvent = getRandomMatch(list.length);
                newEvent.noBroadcast = j+1 !== event.numMatches; // only broadcast the last one
                bus.post('registerMatch', newEvent);
            }
            event.deferred.resolve();
        });
    });
};
