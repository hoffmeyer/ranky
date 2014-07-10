var _ = require('underscore')._,
    validator = require('../logic/validator.js'),
    db = require('monk')('localhost/ranky'),
    dbEvent = db.get('events'),
    model = require('../models/model.js'),
    rankingEngine = require('../logic/rankingEngine.js');

module.exports = (function(){
  'use strict';

  var players = {};

  var storeEvent = function(event) {
    dbEvent.insert(event);
    return true;
  };


  var newPlayer = function(event) {
    var newPlayer = model.createPlayer({name: event.playerName, initialScore: 1000});
    players[newPlayer.id] = newPlayer;
    return newPlayer;
  };

  var populateTeamWithPlayers = function(team) {
    team.players = _.map(team.players, function(elem) { return players[elem];});
    return team;
  };

  var setScoresOnPlayers = function(scores) {
    _.each(scores, function(val, key) {
      if(val > 0) {
        players[key].addPoints(val);
      } else {
        players[key].subtractPoints(-val);
      }
    });
  };

  var addMatch = function(event) {
    var team1 = populateTeamWithPlayers(event.team1);
    var team2 = populateTeamWithPlayers(event.team2);
    var scores = rankingEngine.score(team1, team2);
    setScoresOnPlayers(scores);
  };

  return {
    validateEvent: function(event) {
      return validator.validateEvent(event);
    },
    handleEvent: function(event) {
      if(storeEvent(event)) {
        switch(event.type) {
          case 'createPlayerEvent':
            newPlayer(event);
            break;
          case 'registerMatchEvent':
            addMatch(event);
            break;
          default:
            console.log('Unknown event received in handleEvent: ' + JSON.stringify(event));
        }
      }
    },
    getPlayers: function() {
      var convert = function(val) {
        return val.toJSON();
      };
      var sort = function(val) {
        return - val.points;
      };
      return _.chain(players).map(convert).sortBy(sort).value();
    },
    getPlayer: function(id) {
      if(players.hasOwnProperty(id)){
        return players[id];
      } else {
        throw {
          message: 'Unknown player id',
          name: 'InvalidPlayerIdException'
        };
      }
    }
  };
})();
