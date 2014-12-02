var should = require('should'),
    bus = require('../../logic/eventBus.js')(),
    scoringEngine = require('../../modules/ScoringEngine.js');

describe('scoringEngine', function() {
'use strict';

    scoringEngine(bus);

    describe('scoreMatchEvent', function(){

        describe('team1 wins', function() {
            var scores;
            it('two equal players play, and player 1 wins', function(done){
                bus.post('scoreMatch', {
                    team1: {
                        players: [{id: 1, getPoints: function(){return 1000;}}],
                        score: 10
                    },
                    team2: {
                        players: [{id: 2, getPoints: function(){return 1000;}}],
                        score: 5
                    }
                }).then(function(scores) {
                    scores[1].should.eql(25);
                    scores[2].should.eql(-25);
                    done();
                }).catch(function(err){
                    done(err);
                });
            });

        });

        describe('team1 wins', function() {
            var scores;
            it('two teams of two people', function(done){
                bus.post('scoreMatch', {
                    team1: {
                        players: [{id: 1, getPoints: function(){return 1500;}},{id: 2, getPoints: function(){return 1200;}}],
                        score: 10
                    },
                    team2: {
                        players: [{id: 3, getPoints: function(){return 500;}}, {id: 4, getPoints: function(){return 1800;}}],
                        score: 5
                    }
                }).then(function(scores) {
                    scores[1].should.eql(19.5);
                    scores[2].should.eql(19.5);
                    scores[3].should.eql(-19.5);
                    scores[4].should.eql(-19.5);
                    done();
                }).catch(function(err){
                    done(err);
                });
            });

        });

        describe('team2 wins', function() {
            var scores;
            it('two equal players play, and player two wins', function(done){
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
                    scores[1].should.eql(-25);
                    scores[2].should.eql(25);
                    done();
                }).catch(function(err){
                    done(err);
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
                    should.warn = false;
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

