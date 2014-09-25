var should = require('should');

describe('rankList', function() {
        createPlayerEvent = {
            type: 'createPlayerEvent',
            playerName: 'John',
            callback: function() {}
        };

    describe('creation', function() {
        var rankList = require('../../modules/RankList.js')();

        it('should be created successfully', function() {
            rankList.should.exist;
        })

    });

    describe('create player', function(){
        var busMock = { post: function() {} },
            rankList = require('../../modules/RankList.js')(),
            createPlayer = Object.create(createPlayerEvent);

        createPlayer.callback = function(newPlayer) {
            it('ranklist should create a player and return the new player with 1000 points', function(done) {
                var points = newPlayer.getPoints();
                points.should.be.eql(1000);
                done();
            });
        };
        rankList.setBus(busMock);
        rankList.handle(createPlayer);
    });

    describe('Register Match', function(){
        var rankList = require('../../modules/RankList.js')(),
            createPlayer1 = Object.create(createPlayerEvent),
            createPlayer2 = Object.create(createPlayerEvent),
            busMock = { post: function(event) {} },
            player1Id,
            player2Id,
            scoreMatchEvent;


        createPlayer1.playerName = 'John';
        createPlayer1.callback = function(player) {player1Id = player.id};
        createPlayer2.playerName = 'Aage';
        createPlayer2.callback = function(player) {player2Id = player.id};

        rankList.setBus(busMock);
        rankList.handle(createPlayer1);
        rankList.handle(createPlayer2);

        scoreMatchEvent = {
            type: 'registerMatchEvent',
            team1: {
                players: [player1Id],
                score: 10
            },
            team2: {
                players: [player2Id],
                score: 1
            },
            callback: function(scores) {
                it('should have given the winner points, and taken points from the loser', function(done) {
                    scores[player1Id].should.be.greaterThan(scores[player2Id]);
                    done();
                });
            }
        };

        busMock.post = function(event) {
            if(event.type === 'scoreMatchEvent'){
                var scores = {};
                scores[player1Id] = 25;
                scores[player2Id] = -25;
                event.callback(scores);
            }
        };

        rankList.handle(scoreMatchEvent);
    });

    describe('get a sorted list of players and their scores', function() {
        var rankList = require('../../modules/RankList.js')(),
            createPlayer1 = Object.create(createPlayerEvent),
            createPlayer2 = Object.create(createPlayerEvent),
            createPlayer3 = Object.create(createPlayerEvent),
            bus = require('../../logic/eventBus.js')(),
            scoringEngine = require('../../modules/ScoringEngine.js'),
            player1Id,
            player2Id,
            player3Id,
            scoreMatch1,
            scoreMatch2,
            getListEvent;
            
        createPlayer1.playerName = 'John';
        createPlayer1.callback = function(player) {player1Id = player.id};
        createPlayer2.playerName = 'Aage';
        createPlayer2.callback = function(player) {player2Id = player.id};
        createPlayer3.playerName = 'Tim';
        createPlayer3.callback = function(player) {player3Id = player.id};

        bus.register(rankList);
        bus.register(scoringEngine);
        rankList.handle(createPlayer1);
        rankList.handle(createPlayer2);
        rankList.handle(createPlayer3);

        scoreMatch1 = {
            type: 'registerMatchEvent',
            team1: {
                players: [player1Id],
                score: 10
            },
            team2: {
                players: [player2Id],
                score: 1
            },
            callback: function() { }
        };
        rankList.handle(scoreMatch1);
        
        scoreMatch2 = Object.create(scoreMatch1);
        scoreMatch2.team1 = {
            players: [player2Id],
            score: 10
        };
        scoreMatch2.team1 = {
            players: [player3Id],
            score: 1
        };
        rankList.handle(scoreMatch2);

        getListEvent = {
            type: 'getListEvent',
            callback: function(list) {
                list.forEach(function(val){console.log(val.name + ": " + val.getPoints());});
                it('Should return a list of players sorted by points, largest first', function(done){
                    list[0].getPoints().should.be.greaterThan(list[1].getPoints());
                    list[1].getPoints().should.be.greaterThan(list[2].getPoints());
                    done();
                });
            }
        }
        rankList.handle(getListEvent);
    });

    describe('get player', function() {
        var rankList = require('../../modules/RankList.js')(),
            createPlayer = Object.create(createPlayerEvent),
            busMock = { post: function() {} },
            playerId,
            getPlayerEvent;

        rankList.setBus(busMock);

        createPlayer.callback = function(player){ playerId = player.id};

        rankList.handle(createPlayer);
        
        getPlayerEvent = {
            type: 'getPlayerEvent',
            playerId: playerId,
            callback: function(player) {
                it('should return a player', function(done){
                    player.name.should.eql('John');
                    done();
                });
            }
        };

        rankList.handle(getPlayerEvent);
    });
});
