// initialize app
var express = require('express'),
    app = express(),
    http = require('http').Server(app),
    bodyParser = require('body-parser'),
    routes = require('./routes/routes.js'),
    dbUri = process.env.MONGOLAB_URI || 'localhost/ranky',
    db = require('monk')(dbUri),
    io = require('socket.io')(http),
    dbEvent = db.get('events'),
    ranky = require('./logic/ranky.js')(io),
    events = require('./events/events.js'),
    databaseConnected = false;

// to support JSON-encoded bodies
app.use(bodyParser.json());

// give access to ranky in the router
app.use(function(req, res, next){
    req.ranky = ranky;
    next();
});

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

// set router
app.use('/', routes);

// serve resources from public folder eg css an client side js
app.use(express.static(__dirname + '/public'));

var startHttpServer = function(){
    var server = http.listen(process.env.PORT || 3000, function() { // process.env.PORT supplied by Heroku
        console.log('Listening on port %d', server.address().port);
    });
};

// load data from database
var loadEventsFromDB = function() {
    dbEvent.find({},{sort: {id: 1}}, function(err, docs){
        if(err){
            console.trace(err);
        } else {
            console.log('Database connected at ' + dbUri);
            databaseConnected = true;
            var i = 0;
            // function for chaining the events to roll them on synchronously
            var loadEvent = function(event){
                events.setNextId(event.id+1);
                i++;
                ranky.handleEvent(event).then(function(){
                    if(i < docs.length){
                        loadEvent(docs[i]);
                    } else {
                        console.log('Loaded ' + i + ' events from db');
                        startHttpServer();
                    }
                });
            };
            if(docs && docs.length > 0){
                loadEvent(docs[0]);
            } else {
                startHttpServer();
            }
        }
    });
};

loadEventsFromDB();
