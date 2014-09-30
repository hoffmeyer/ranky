var express = require('express'),
    router = express.Router(),
    events = require('../events/events.js'),
    _ = require('underscore')._;

router.get('/list', function(req, res) {
    req.ranky.handleEvent({ type: 'getList'})
        .then(function(list){
            res.send(_.map( list, function(player){ return player.toJSON(); }));
        });
});

router.get('/player/:id(\\d+)/', function(req, res) {
    req.ranky.handleEvent({
        type: 'getPlayer',
        playerId: req.params.id,
    }).then(function(player){
        res.send(player.toJSON());
    });
});

router.post('/player', function(req, res) {
    var event = events.createPlayer(req.body.name);
    if(req.ranky.validateEvent(event)){
        req.ranky.handleEvent(event, true).then(function(player){
            res.send(player.toJSON());
        });
    } else {
        res.send(400);
    }
});

router.post('/match', function(req, res) {
    var event,
        validTeam1 = req.body.team1 && req.body.team1.players && req.body.team1.score,
        validTeam2 = req.body.team2 && req.body.team2.players && req.body.team2.score;

    if(validTeam1 && validTeam2) { 
        event = events.registerMatch(
            req.body.team1.players,
            req.body.team1.score,
            req.body.team2.players,
            req.body.team2.score);

        if(req.ranky.validateEvent(event)) {
            req.ranky.handleEvent(event, true).then(function(){
                res.send(scores);
            });
        } else {
            res.send(400);
        }
    } else {
        res.send(400);
    }
});

module.exports = router;
