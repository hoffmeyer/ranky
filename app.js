// initialize app
var express = require('express'),
    app = express(),
    http = require('http').Server(app),
    bodyParser = require('body-parser'),
    routes = require('./routes/routes.js'),
    db = require('monk')('localhost/ranky'),
    io = require('socket.io')(http),
    _ = require('underscore')._,
    dbEvent = db.get('events'),
    ranky = require('./logic/ranky.js')(io),
    events = require('./events/events.js');

app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(function(req, res, next){
    req.ranky = ranky;
    next();
});
app.use('/', routes);

app.set('views', __dirname + '/tpl');
app.set('view engine', 'jade');
app.engine('jade', require('jade').__express);
app.get('/', function(req, res){
    res.render('index');
});
app.use(express.static(__dirname + '/public'));

// load data from database
var loadEventsFromDB = function() {
    dbEvent.find({},{sort: {id: 1}}, function(err, docs){
        _.map(docs, function(event){
            event.noBroadcast = true; // replayed events should not be broadcasted to external sources
            ranky.handleEvent(event);
            events.setNextId(event.id+1);
        });
    });
};

loadEventsFromDB();

// start server
var server = http.listen(process.env.PORT || 3000, function() { // process.env.PORT supplied by Heroku
    console.log('Listening on port %d', server.address().port);
});
