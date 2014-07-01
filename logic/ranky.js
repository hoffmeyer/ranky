var _ = require('underscore')._,
    validator = require('../logic/validator.js'),
    db = require('monk')('localhost/ranky'),
    dbEvent = db.get('events'),
    model = require('../models/model.js');

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

  var addMatch = function(event) {
    if(isNaN(event.team1.score) || isNaN(event.team2.score)) {
      throw {
        message: 'scores must be a number',
        name: 'InvalidParameterException'
      };
    }
    var team1players = _.map(event.team1.players, function(elem) {return players[elem];});
    var team2players = _.map(event.team2.players, function(elem) {return players[elem];});
    if(team1players.length > 0 && team2players.length > 0) {
      var points = 25;
      if(event.team1.score > event.team2.score) {
        _.map(team1players, function(elem) { return elem.addPoints(points/team1players.length);});
        _.map(team2players, function(elem) { return elem.subtractPoints(points/team2players.length);});
      } else {
        _.map(team1players, function(elem) { return elem.subtractPoints(points/team1players.length);});
        _.map(team2players, function(elem) { return elem.addPoints(points/team2players.length);});
      }
    } else {
      throw {
        message: 'Unknown player received player1Id; ' + event.player1Id + ' player2Id: ' + event.player2Id,
        name: 'InvalidPlayerIdException'
      };
    }
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
        return players[id].toJSON();
      } else {
        throw {
          message: 'Unknown player id',
          name: 'InvalidPlayerIdException'
        };
      }
    }
  };
})();
