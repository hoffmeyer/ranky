'use strict';
var express = require('express'),
    router = express.Router(),
    ranky = require('../logic/ranky.js'),
    events = require('../events/events.js');

router.get('/list', function(req, res) {
    ranky.handleEvent({
        type: 'getListEvent',
        callback: function(list) {
                res.send(list);
        } 
    });
});

router.get('/player/:id(\\d+)/', function(req, res) {
    res.send(ranky.getPlayer(req.params.id).toJSON());
});

router.post('/player', function(req, res) {
    var event = events.createPlayer(req.body.name);
    if(ranky.validateEvent(event)) {
        ranky.handleEvent(event, true);
        res.send(201);
    } else {
        res.send(400);
    }
});

router.post('/match', function(req, res) {
    var event = events.registerMatch(
        req.body.team1.players,
        req.body.team1.score,
        req.body.team2.players,
        req.body.team2.score);

    if(ranky.validateEvent(event)) {
        ranky.handleEvent(event, true);
        res.send(200);
    } else {
        res.send(400);
    }

});

module.exports = router;
