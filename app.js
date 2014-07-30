'use strict';
// initialize app
var express = require('express'),
    bodyParser = require('body-parser'),
    routes = require('./routes/routes.js'),
    app = express(),
    db = require('monk')('localhost/ranky'),
    dbEvent = db.get('events'),
    ranky = require('./logic/ranky.js'),
    events = require('./events/events.js'),
    _ = require('underscore')._,
    http = require('http').Server(app),
    io = require('socket.io')(http);

app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use('/', routes);

app.set('views', __dirname + '/tpl');
app.set('view engine', 'jade');
app.engine('jade', require('jade').__express);
app.get('/', function(req, res){
      res.render('index');
});
app.use(express.static(__dirname + '/public'));

io.on('connection', function(socket){
  console.log('a user connected');
});


io.sockets.on('connection', function (socket) {
  socket.emit('message', { message: 'welcome to ranky' });
  socket.on('send', function (data) {
    console.log('message received');
  });
});

// generate test dummy data
var generateTestData = function() {
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
var server = http.listen(3000, function() {
});
