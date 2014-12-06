// initialize app
var express = require('express'),
    app = express(),
    http = require('http').Server(app),
    bodyParser = require('body-parser'),
    routes = require('./routes/routes.js'),
    db = require('monk')(process.env.MONGOLAB_URI || 'localhost/ranky'),
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
app.get('/test', function(req, res){
    res.render('testData');
});
app.use(express.static(__dirname + '/public'));

// load data from database
var loadEventsFromDB = function() {
    dbEvent.find({},{sort: {id: 1}}, function(err, docs){
        var i = 0;
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
if(process.argv[2] === 'test'){
    require('./logic/testDataGenerator.js')(ranky, 50, 1000);
}

// start server
var server = http.listen(process.env.PORT || 3000, function() { // process.env.PORT supplied by Heroku
    console.log('Listening on port %d', server.address().port);
});
