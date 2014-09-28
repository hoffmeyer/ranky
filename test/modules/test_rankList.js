var _ = require('underscore')._,
    should = require('should'),
    bus = require('../../logic/eventBus.js')(),
    rankList = require('../../modules/RankList.js');

describe('rankList', function() {

    rankList(bus);

    describe('create player', function() {
        var player1,
            player2;

        it('should call the callback when creating a new player', function(done) {
            bus.post('createPlayer', {
                playerName: 'John',
                callback: function(player) { 
                    player.should.be.ok;
                    player.getPoints().should.eql(1000);
                    player1 = player;
                    done();
                }
            });
        }); 
    });
});
