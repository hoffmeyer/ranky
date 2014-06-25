// initialize app
var express = require('express'),
    bodyParser = require('body-parser'),
    routes = require('./routes/routes.js'),
    app = express(),
    db = require('monk')('localhost/ranky'),
    dbEvent = db.get('events'),
    ranky = require('./logic/ranky.js'),
    events = require('./events/events.js'),
    _ = require('underscore')._;

app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use('/', routes);

// generate test dummy data
var generateTestData = function() {
  'use strict';
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
    console.log('Generating test player ' + name);
    ranky.handleEvent(events.createPlayer(name));
  });

  var numMatches = 100,
      remainingMatches = 100;

  var genId = function() {
    return Math.floor((Math.random() * names.length)+1);
  };
  var genScore = function() {
    return Math.floor((Math.random() * 11) );
  };
  do {
    console.log('Generating test match ' + (numMatches-remainingMatches+1) + '/' + numMatches);
    ranky.handleEvent(events.registerMatch([genId(), genId()], genScore(), [genId(),genId()], genScore()));
    remainingMatches--;
  } while(remainingMatches> 0);
};

// load data from database
var loadEventsFromDB = function() {
  'use strict';
  dbEvent.find({},{sort: {id: 1}}, function(err, docs){
    _.map(docs, function(event){
      ranky.handleEvent(event);
      events.setNextId(event.id+1);
    });

    if(!docs.length){
      generateTestData();
    }
  });
};

loadEventsFromDB();

// start server
var server = app.listen(3000, function() {
  'use strict';
  console.log('Listening on port %d', server.address().port);
});
