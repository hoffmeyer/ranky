// initialize app
var express = require('express'),
    util = require('util'),
    compress = require('compression'),
    app = express(),
    http = require('http').Server(app),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    morgan = require('morgan'),
    routes = require('./routes/routes.js'),
    io = require('socket.io')(http),
    pg = require('pg'),
    connectionString = process.env.DATABASE_URL || 'postgres://ranky:12345q@db/ranky',
    ranky = require('./logic/ranky.js')(io, pg, connectionString),
    events = require('./events/events.js');

app.use(compress());
app.use(bodyParser.json());
app.use(cookieParser());
app.use(require('./config/loggerConfig.js').apiLogger);

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
    console.log( 'Fetching stored evetns from db...');
    pg.connect(connectionString, function(err, client, done) {
        if(err){
            console.error('Error fetching client from pool using connString ' + connectionString, err);
        } else {
            client.query('CREATE TABLE IF NOT EXISTS EVENTS( ID    INT NOT NULL PRIMARY KEY, DATA    JSON )', function(err, result){ if(err) {
                    console.error('Failed to create table events');
                }
                console.log('Created table events if not existing');
            });
            client.query('SELECT * FROM events', function(err, result){
                done(); // release client back to conn pool
                if(err){
                    console.error('Error running query', err);
                }
                console.log('Queried ' + result.rows.length + ' events from database.');
                console.log( 'Applying events...');
                var i = 0;
                // function for chaining the events to roll them on synchronously
                var loadEvent = function(event){
                    events.setNextId(event.id+1);
                    i++;
                    ranky.handleEvent(event).then(function(){
                        if(i < result.rows.length){
                            loadEvent(result.rows[i].data);
                        } else {
                            console.log('Loaded ' + i + ' events from db');
                            startHttpServer();
                        }
                    });
                };
                if(result.rows && result.rows.length > 0){
                    loadEvent(result.rows[0].data);
                } else {
                    startHttpServer();
                }
            });
        }
    });
};

loadEventsFromDB();
