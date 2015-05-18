var _ = require('underscore')._,
    should = require('should'),
    bus = require('../../logic/eventBus.js')(),
    rankList = require('../../modules/RankList.js');

describe('rankList', function() {


    describe('create player', function() {
        var bus = require('../../logic/eventBus.js')(),
            rankList = require('../../modules/RankList.js');

        rankList(bus);

        it('should resolve the promise when creating a player', function(done) {
            bus.post('createPlayer', {
                playerName: 'John',
            }).then(function(player){
                player.should.be.ok;
                player.getPoints().should.eql(1000);
                player1 = player;
                done();
            });
        }); 
    });

    describe('register match', function() {
        var bus = require('../../logic/eventBus.js')(),
            rankList = require('../../modules/RankList.js');

        rankList(bus);
        
        bus.post('createPlayer', { playerName: 'John', }).then(function(player1){
            bus.post('createPlayer', { playerName: 'Aage', }).then(function(player2){
                it('should emit a scoreMatch event when registering a match', function(done){
                    bus.listen('scoreMatch', function(event){
                        event.team1.players[0].should.eql(player1);
                        event.team2.players[0].should.eql(player2);
                        done();
                    });
                    var matchEvent = {
                        team1: {
                            players: [player1.id],
                            score: 10
                        },
                        team2: {
                            players: [player2.id],
                            score: 1
                        }
                    };
                    bus.post('registerMatch', matchEvent);
                });
            });
        });
    });

    describe('register match and distribute scores', function() {
        var bus = require('../../logic/eventBus.js')(),
            rankList = require('../../modules/RankList.js');

        rankList(bus);
        
        bus.post('createPlayer', { playerName: 'John', }).then(function(player1){
            bus.post('createPlayer', { playerName: 'Aage', }).then(function(player2){
                it('should have received the correct scores from the scoring engine', function(done){
                    var scoresStub = {};
                    scoresStub[player1.id] = 25; 
                    scoresStub[player2.id] = -25;
                    bus.listen('scoreMatch', function(event){
                        event.deferred.resolve(scoresStub);
                    });
                    var matchEvent = {
                        team1: {
                            players: [player1.id],
                            score: 10
                        },
                        team2: {
                            players: [player2.id],
                            score: 1
                        }
                    };
                    bus.post('registerMatch', matchEvent).then(function(scores){
                        scores.should.eql(scoresStub);
                        done();
                    });
                });
                it('should have distributed the points on the correct players', function(){
                    player1.getPoints().should.eql(1025);
                    player2.getPoints().should.eql(975);
                });
            });
        });
    });
});
