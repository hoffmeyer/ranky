'use strict';
var express = require('express'),
    router = express.Router(),
    ranky = require('../logic/ranky.js'),
    events = require('../events/events.js'),
    _ = require('underscore')._;

router.get('/list', function(req, res) {
    ranky.handleEvent({
        type: 'getListEvent',
        callback: function(list) {
            res.send(_.map( list, function(player){ return player.toJSON(); }));
        } 
    });
});

router.get('/player/:id(\\d+)/', function(req, res) {
    ranky.handleEvent({
        type: 'getPlayerEvent',
        playerId: req.params.id,
        callback: function(player) {
            res.send(player.toJSON());
        }
    });
    res.send(ranky.getPlayer(req.params.id).toJSON());
});

router.post('/player', function(req, res) {
    var event = events.createPlayer(req.body.name);
    event.callback = function(player){
        res.send(player.toJSON());
    };
    if(ranky.validateEvent(event)){
        ranky.handleEvent(event, true);
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

        event.callback = function(scores) {
            res.send(scores);
        };
        
        if(ranky.validateEvent(event)) {
            ranky.handleEvent(event, true);
        } else {
            res.send(400);
        }
    } else {
        res.send(400);
    }
});

module.exports = router;
