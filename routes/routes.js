var express = require('express'),
    ranky = require('../logic/ranky.js'),
    router = express.Router();

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
  var playerName = req.body.name;
  ranky.newPlayer(playerName);
  res.send(200);
});

router.post('/match', function(req, res) {
  'use strict';
  var player1 = req.body.player1,
      player2 = req.body.player2,
      score1  = req.body.score1,
      score2  = req.body.score2;
  ranky.addMatch(player1, score1, player2, score2);
  res.send(200);
});

module.exports = router;

var initDummyData = function() {
  'use strict';
  ranky.newPlayer('Flemming');
  ranky.newPlayer('Jens');
};

initDummyData();
