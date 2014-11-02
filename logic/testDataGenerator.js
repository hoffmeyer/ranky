var events = require('../events/events.js');

module.exports = function(ranky,  numPlayers, numMatches){
    var getRandom = function(num){
        return Math.floor((Math.random() * num) + 1)
    };

    var getRandomMatch = function(){
        var player1 = getRandom(numPlayers),
            player2 = getRandom(numPlayers),
            score1 = getRandom(11) - 1,
            score2 = getRandom(11) - 1;
        return events.registerMatch([player1], score1, [player2], score2);
    };

    console.log('Creating ' + numPlayers + ' players');
    for(var i = 1; i <= numPlayers; i++){
        ranky.handleEvent(events.createPlayer('Player' + i));
    }
    console.log(numPlayers + ' players created');

    console.log('Playing ' + numMatches + ' matches');
    for(var j = 0; j < numMatches; j++){

        ranky.handleEvent(getRandomMatch());
    }
    console.log(numPlayers + ' matches played');

};
