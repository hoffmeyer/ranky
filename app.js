// initialize app
var express = require('express'),
    util = require('util'),
    compress = require('compression'),
    app = express(),
    http = require('http').Server(app),
    bodyParser = require('body-parser'),
    routes = require('./routes/routes.js'),
    dbUri = util.format('mongodb://mongo:%s/ranky', process.env.MONGO_PORT),
    mongoClient = require('mongodb').MongoClient,
    io = require('socket.io')(http),
    ranky = require('./logic/ranky.js')(io),
    events = require('./events/events.js');

// wait for database


// to support JSON-encoded bodies
app.use(compress());
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
    var server = http.listen(process.env.PORT || 3000, function(err) { // process.env.PORT supplied by Heroku
        if(err){
            console.log('Could not start server on %d', server.address().port);
            console.trace(err);
        } else {
            console.log('Listening on port %d', server.address().port);
        }
    });
};

// load data from database
var loadEventsFromDB = function() {
    mongoClient.connect(dbUri, function(err, db){
        if(err){
            console.error('Could not connect to da database %s', dbUri);
            console.trace(err);
        } else {
            console.log('Database connected at ' + dbUri);
            var dbEvents = db.collection('events');
            dbEvents.find().sort({id: 1}).toArray(function(err, docs){
                if(err){
                    console.error('No documents found in collection events');
                    console.trace(err);
                } else {
                    console.log('Events queried successfully');
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
                                db.close();
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
        }
    });
};

setTimeout(function(){
    loadEventsFromDB();
}, 3000);
