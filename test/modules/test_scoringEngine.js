'use strict';
var should = require('should'),
    bus = require('../../logic/eventBus.js'),
    scoringEngine = require('../../modules/ScoringEngine.js');

bus.register(scoringEngine);

bus.post({
    type: 'scoreMatchEvent',
    team1: {
        players: [{id: 1}],
        score: 10
    },
    team2: {
        players: [{id: 2}],
        score: 5
    },
    callback: function(scores) {
        scores.should.eql({1: 25, 2: -25});
    }
});

