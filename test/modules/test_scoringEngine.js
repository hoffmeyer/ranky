var should = require('should'),
    bus = require('../../logic/eventBus.js')(),
    scoringEngine = require('../../modules/ScoringEngine.js');

describe('scoringEngine', function() {
'use strict';

    scoringEngine(bus);

    describe('scoreMatchEvent', function(){

        describe('team1 wins', function() {
            var scores;
            bus.post('scoreMatch', {
                team1: {
                    players: [{id: 1}],
                    score: 10
                },
                team2: {
                    players: [{id: 2}],
                    score: 5
                },
                callback: function(scores) {
                    it('give player1 25 points and player2 -25 points', function(done){
                        scores.should.eql({1: 25, 2: -25});
                        done();
                    });
                }
            });

        });

        describe('team2 wins', function() {
            var scores;
            bus.post('scoreMatch', {
                team1: {
                    players: [{id: 1}],
                    score: 5 
                },
                team2: {
                    players: [{id: 2}],
                    score: 10
                },
                callback: function(scores) {
                    it('give player1 -25 points and player2 25 points', function(done){
                        scores.should.eql({1: -25, 2: 25});
                        done();
                    });
                }
            });

        });

        describe('tied match', function(){
            var scores;
            bus.post('scoreMatchEvent', {
                team1: {
                    players: [{id: 1}],
                    score: 10
                },
                team2: {
                    players: [{id: 2}],
                    score: 10
                },
                callback: function(scores) {
                    it('give all players zero points if the match is tied', function(done){
                        scores.should.eql({1: 0, 2: 0});
                        done();
                    });
                }
            });
        });
    });


    describe('unknownEvent', function() {
        var test;
        bus.post('unknownEvent', {
            callback: function(){
                test = 'test';
            }
        });

        it('ignore an unknown event', function() {
            (test === undefined).should.be.true;
        });
    });
});

