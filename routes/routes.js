var express = require('express'),
    router = express.Router(),
    ranky = require('../logic/ranky.js'),
    events = require('../events/events.js');

router.get('/', function(req, res) {
  'use strict';
  res.send('Ranky is here');
});

router.get('/list', function(req, res) {
  'use strict';
  res.send(ranky.getPlayers());
});

router.post('/player', function(req, res) {
  'use strict';
  var event = events.createPlayer(req.body.name);
  if(ranky.validateEvent(event)) {
    ranky.handleEvent(event);
    res.send(201);
  } else {
    res.send(400);
  }
});

router.post('/match', function(req, res) {
  'use strict';
  var event = events.registerMatch(
    req.body.team1.players,
    req.body.team1.score,
    req.body.team2.players,
    req.body.team2.score);

  if(ranky.validateEvent(event)) {
    ranky.handleEvent(event);
    res.send(200);
  } else {
    res.send(400);
  }

});

module.exports = router;
