var models = require('../../models/models.js');

describe('models', function() {
    var player1 = models.createPlayer({name: 'Holger', initialScore: 1000}),
        player2 = models.createPlayer({name: 'Jan', initialScore: 1000}),
        player3 = models.createPlayer({name: 'Stig', initialScore: 1000});

    describe('id incrementation', function() {
        it('should increment the id every time a new model is created', function(){
            player1.id.should.eql(1);
            player2.id.should.eql(2);
            player3.id.should.eql(3);
        });
    });

    describe('setting constructor values', function(){
        it('should set the values given at creation', function(){
            player1.name.should.eql('Holger');
            player1.getPoints().should.eql(1000);
        });
    });

    describe('adding Points', function() {
        it('points are added correctly to the player', function() {
            var pointsToAdd = 10,
                orgPoints = player1.getPoints();

            player1.addPoints(10);
            player1.getPoints().should.eql(orgPoints + pointsToAdd);
        });
    });

    describe('removing Points', function() {
        it('points are removed correctly from the player', function() {
            var pointsToSubtract = 10,
                orgPoints = player1.getPoints();

            player1.subtractPoints(10);
            player1.getPoints().should.eql(orgPoints - pointsToSubtract);
        });
    });

    describe('JSON conversion is correct', function() {
        var json = player1.toJSON();
        it('correctly convert the player to JSON', function() {
            json.should.have.property('id');
            json.should.have.property('name');
            json.should.have.property('gamesPlayed');
            json.should.have.property('points');
            json.should.have.property('lostGames');
            json.should.have.property('wonGames');
            json.should.have.property('mostWinsInRow');
            json.should.have.property('mostLossesInRow');
        });
    });
    
});
