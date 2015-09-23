// initialize app
var express = require('express'),
    compress = require('compression'),
    app = express(),
    http = require('http').Server(app),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    routes = require('./routes/routes.js'),
    io = require('socket.io')(http),
    pg = require('pg'),
    connectionString = process.env.DATABASE_URL || 'postgres://ranky:12345q@db/ranky',
    eventLoader = require('./logic/eventLoader')(connectionString),
    ranky = require('./logic/ranky.js')(io, pg, connectionString),
    eventLoader = require('./logic/eventLoader')(connectionString, ranky);

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

// serve resources from public folder eg css and client side js
app.use(express.static(__dirname + '/public'));

var startHttpServer = function(){
    var server = http.listen(process.env.PORT || 3000, function(err) {
        if(err){
            console.log('Could not start server on %d', server.address().port);
            console.trace(err);
        } else {
            console.log('Listening on port %d', server.address().port);
        }
    });
};

eventLoader.initialize()
.then(eventLoader.loadEvents)
.then(startHttpServer)
.catch(function(error){
  console.error(error);
});
