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
  ranky.newPlayer(req.body.name);
  res.send(200);
});

router.post('/match', function(req, res) {
  'use strict';
  ranky.addMatch(
    req.body.player1,
    req.body.score1,
    req.body.player2,
    req.body.score2);
  res.send(200);
});

module.exports = router;

// for testing only.. remove when datbase has been added

var names = [
  'Knuspar',
  'Olfie',
  'Muhammed',
  'Gunter',
  'Ingeborg',
  'Egon',
  'Sweinhund',
  'Johanes',
  'Ib',
  'Lulu',
  'Rose',
  'Bolcheface',
  'Bomberman',
  'NicerDicer',
  'Numseman'
];

names.map(function(name) {
  'use strict';
  ranky.newPlayer(name);
});

var numMatches = 1000;
var genId = function() {
  'use strict';
  return Math.floor((Math.random() * names.length)+1);
};
var genScore = function() {
  'use strict';
  return Math.floor((Math.random() * 11) );
};
do {
  ranky.addMatch(genId(), genScore(), genId(), genScore());
  numMatches--;
} while(numMatches > 0);
