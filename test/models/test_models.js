var models = require('../../models/models.js');

describe('models', function() {
    var playerEvent1 = models.createPlayer({name: 'Holger', initialScore: 1000}),
        playerEvent2 = models.createPlayer({name: 'Jan', initialScore: 1000}),
        playerEvent3 = models.createPlayer({name: 'Stig', initialScore: 1000});

    describe('id incrementation', function() {
        it('should increment the id every time a new model is created', function(){
            playerEvent1.id.should.eql(1);
            playerEvent2.id.should.eql(2);
            playerEvent3.id.should.eql(3);
        });
    });
    
});
