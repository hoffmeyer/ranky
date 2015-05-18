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
    console.log('received in post match');
    var event,
        validTeam1 = req.body.team1 && req.body.team1.players && req.body.team1.score >= 0,
        validTeam2 = req.body.team2 && req.body.team2.players && req.body.team2.score >= 0;

    if(validTeam1 && validTeam2) { 
        event = events.registerMatch(
            req.body.team1.players,
            req.body.team1.score,
            req.body.team2.players,
            req.body.team2.score);

        if(req.ranky.validateEvent(event)) {
            req.ranky.handleEvent(event, true).then(function(scores){
                res.send(scores);
            }, function(error){
                res.send(500, error);
            });
        } else {
            res.send(400, 'invalid request');
        }
    } else {
        res.send(400, 'invalid request');
    }
});

router.post('/test/generatePlayers', function(req, res){
    req.ranky.handleEvent({type: 'generateTestPlayers', numPlayers: req.body.numPlayers}).then(function(){
        res.send(200);
    });
});

router.post('/test/generateMatches', function(req, res){
    req.ranky.handleEvent({type: 'generateTestMatches', numMatches: req.body.numMatches}).then(function(){
        res.send(200);
    });
});

module.exports = router;
