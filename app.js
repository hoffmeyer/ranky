// initialize app
var express = require('express'),
    app = express(),
    http = require('http').Server(app),
    bodyParser = require('body-parser'),
    routes = require('./routes/routes.js'),
    db = require('monk')(process.env.MONGOLAB_URI || 'localhost/ranky'),
    io = require('socket.io')(http),
    dbEvent = db.get('events'),
    ranky = require('./logic/ranky.js')(io),
    events = require('./events/events.js');

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

// setup jade for templating
app.set('views', __dirname + '/tpl');
app.set('view engine', 'jade');
app.engine('jade', require('jade').__express);

// static pages
app.get('/', function(req, res){
    res.render('index');
});
app.get('/test', function(req, res){
    res.render('testData');
});

// serve resources from public folder eg css an client side js
app.use(express.static(__dirname + '/public'));

// load data from database
var loadEventsFromDB = function() {
    dbEvent.find({},{sort: {id: 1}}, function(err, docs){
        var i = 0;
        // function for chaining the events to roll them on synchronously
        var loadEvent = function(event){
            events.setNextId(event.id+1);
            i++;
            ranky.handleEvent(event).then(function(){
                if(i < docs.length){
                    loadEvent(docs[i]);
                }
            });
        };
        loadEvent(docs[0]);
    });
};

loadEventsFromDB();

// start server
var server = http.listen(process.env.PORT || 3000, function() { // process.env.PORT supplied by Heroku
    console.log('Listening on port %d', server.address().port);
});
