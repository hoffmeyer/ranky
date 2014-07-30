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

// load data from database
var loadEventsFromDB = function() {
  dbEvent.find({},{sort: {id: 1}}, function(err, docs){
    _.map(docs, function(event){
      ranky.handleEvent(event);
      events.setNextId(event.id+1);
    });
  });
};

loadEventsFromDB();

// start server
var server = http.listen(3000, function() {
  console.log('Listening on port %d', server.address().port);
});
