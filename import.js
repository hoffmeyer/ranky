var LineByLineReader = require('line-by-line'),
    lr = new LineByLineReader('ranky_export.csv'),
    db = require('monk')('localhost/ranky'),
    dbEvent = db.get('events'),
    players = [],
    numMatches = 0,
    nextEventId = 1;


var getOrCreatePlayerId = function(playerName){
    var id;
    players.forEach(function(player, index){

        if(player === playerName){
            id = index + 1;
            return false;
        }
    });
    if(!id){
        players.push(playerName);
        dbEvent.insert({
            id: nextEventId++,
            type: 'createPlayer',
            playerName:  playerName
        });
        return players.length;
    }
    return id;
};

lr.on('error', function (err) {
    console.log('Ohhh noes... error!');
});

lr.on('line', function (line) {
    var parts = line.split(','),
        team1Players = [parts[0], parts[1]].filter(function(e){return e !== '-';}).map(getOrCreatePlayerId),
        team2Players = [parts[2], parts[3]].filter(function(e){return e !== '-';}).map(getOrCreatePlayerId);

    var event = {
        id: nextEventId++,
        type: 'registerMatch',
        team1: {
            players : team1Players,
            score : parseInt(parts[4], 10)
        },
        team2: {
            players  : team2Players,
            score : parseInt(parts[5], 10)
        }
    };

    dbEvent.insert(event);

    numMatches++;
});

lr.on('end', function () {
    console.log('Created ' + players.length + ' players, and played ' + numMatches + ' matches');
    db.close();
});
