var should = require('should'),
    bus = require('../../logic/eventBus.js'),
    scoringEngine = require('../../modules/ScoringEngine.js');

describe('scoringEngine', function() {
'use strict';

    bus.register(scoringEngine);

    describe('scoreMatchEvent', function(){

        describe('team1 wins', function() {
            var scores;
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
                callback: function(s) {
                    scores = s;
                }
            });

            it('give player1 25 points and player2 -25 points', function(){
                scores.should.eql({1: 25, 2: -25});
            });
        });

        describe('team2 wins', function() {
            var scores;
            bus.post({
                type: 'scoreMatchEvent',
                team1: {
                    players: [{id: 1}],
                    score: 5 
                },
                team2: {
                    players: [{id: 2}],
                    score: 10
                },
                callback: function(s) {
                    scores = s;
                }
            });

            it('give player1 -25 points and player2 25 points', function(){
                scores.should.eql({1: -25, 2: 25});
            });
        });

        describe('tied match', function(){
            var scores;
            bus.post({
                type: 'scoreMatchEvent',
                team1: {
                    players: [{id: 1}],
                    score: 10
                },
                team2: {
                    players: [{id: 2}],
                    score: 10
                },
                callback: function(s) {
                    scores = s;
                }
            });

            it('give all players zero points if the match is tied', function(){
                scores.should.eql({1: 0, 2: 0});
            });
        });
    });


    describe('unknownEvent', function() {
        var test;
        bus.post({
            type: 'unknownEvent',
            callback: function(){
                test = 'test';
            }
        });

        it('ignore an unknown event', function() {
            (test === undefined).should.be.true;
        });
    });
});

