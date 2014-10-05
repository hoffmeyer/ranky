var should = require('should'),
    bus = require('../../logic/eventBus.js')(),
    scoringEngine = require('../../modules/ScoringEngine.js');

describe('scoringEngine', function() {
'use strict';

    scoringEngine(bus);

    describe('scoreMatchEvent', function(){

        describe('team1 wins', function() {
            var scores;
            it('should give player1 25 points and player2 -25 points', function(done){
                bus.post('scoreMatch', {
                    team1: {
                        players: [{id: 1, getPoints: function(){return 1001;}}],
                        score: 10
                    },
                    team2: {
                        players: [{id: 2, getPoints: function(){return 999;}}],
                        score: 5
                    }
                }).then(function(scores) {
                        scores.should.eql({1: 25, 2: -25});
                        done();
                });
            });

        });

        describe('team2 wins', function() {
            var scores;
            it('should give player1 -25 points and player2 25 points', function(done){
                bus.post('scoreMatch', {
                    team1: {
                        players: [{id: 1, getPoints: function(){return 1000;}}],
                        score: 5 
                    },
                    team2: {
                        players: [{id: 2, getPoints: function(){return 1000;}}],
                        score: 10
                    }
                }).then(function(scores) {
                    scores.should.eql({1: -25, 2: 25});
                    done();
                });
            });

        });

        describe('tied match', function(){
            var scores;
            it('should give all players zero points if the match is tied', function(done){
                bus.post('scoreMatch', {
                    team1: {
                        players: [{id: 1, getPoints: function(){return 1000;}}],
                        score: 10
                    },
                    team2: {
                        players: [{id: 2, getPoints: function(){return 1000;}}],
                        score: 10
                    }
                }).then(function(scores){
                    scores.should.eql({1: 0, 2: 0});
                    done();
                });
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

