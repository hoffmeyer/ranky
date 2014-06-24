var express = require('express'),
    router = express.Router(),
    ranky = require('../logic/ranky.js'),
    db = require('monk')('localhost/ranky'),
    dbEvent = db.get('events'),
    events = require('../events/events.js'),
    _ = require('underscore')._;


// TODO: nasty shit, this function should not just be dumped here to import events from database
(function() {
  dbEvent.find({},{sort: {id: 1}}, function(err, docs){
    _.map(docs, function(event){
      ranky.handleEvent(event);
      events.setNextId(event.id+1);
    });
  });
})();

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

// for testing only.. remove when datbase has been added
/*
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
  ranky.handleEvent(events.createPlayer(name));
});

var numMatches = 100;
var genId = function() {
  'use strict';
  return Math.floor((Math.random() * names.length)+1);
};
var genScore = function() {
  'use strict';
  return Math.floor((Math.random() * 11) );
};
do {
  ranky.handleEvent(events.registerMatch([genId(), genId()], genScore(), [genId(),genId()], genScore()));
  numMatches--;
} while(numMatches > 0);
*/
