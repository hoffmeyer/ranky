// initialize helper stuff
if (typeof Object.create !== 'function') { Object.create = function (o) { var F = function () {}; F.prototype = o; return new F(); }; }

// initialize app
var express = require('express'),
    bodyParser = require('body-parser'),
    app = express();
app.use(bodyParser.json());       // to support JSON-encoded bodies

var nextPlayerId = 1,
    players = {};

var player = (function() {
  'use strict';
  var points = 1000;

  return {
    id: 0,
    name: '',
    addPoints: function(newPoints) {
      if(!isNaN(newPoints) && newPoints > 0) {
        points += newPoints;
      }
      else{
        throw {
          message: 'invalid points, must be a positive number',
          name: 'InvalidParameterException'
        };
      }
    },
    getPoints: function(){
      return points;
    }
  };
})();

var newPlayer = function(name) {
  'use strict';
  var newPlayer = Object.create(player);
  newPlayer.name = name;
  newPlayer.id = nextPlayerId++;
  return newPlayer;
};

var addPlayer = function(playerToAdd) {
  'use strict';
  players[playerToAdd.id] = playerToAdd;
};

app.get('/', function(req, res) {
  'use strict';
  res.send('Ranky is here');
});

app.get('/list', function(req, res) {
  'use strict';
  res.send(players);
});

app.post('/createPlayer', function(req, res) {
  'use strict';
  var playerName = req.body.name;
  addPlayer(newPlayer(playerName));
  res.send(200);
});

// start server
var server = app.listen(3000, function() {
  'use strict';
  console.log('Listening on port %d', server.address().port);
});

var initDummyData = function() {
  'use strict';
  addPlayer(newPlayer('Flemming'));
  addPlayer(newPlayer('Jens'));
};

initDummyData();

