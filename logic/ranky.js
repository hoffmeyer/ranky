var _ = require('underscore')._,
    mongo = require('mongodb'),
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
    if(isNaN(event.score1) || isNaN(event.score2)) {
      throw {
        message: 'scores must be a number',
        name: 'InvalidParameterException'
      };
    }
    var player1 = players[event.player1Id];
    var player2 = players[event.player2Id];
    if(player1 && player2) {
      var points = 25;
      if(event.score1 > event.score2) {
        player1.addPoints(points);
        player2.subtractPoints(points);
      } else {
        player1.subtractPoints(points);
        player2.addPoints(points);
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
      return true; // TODO: implement
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
        return {
          id: val.id,
          name: val.name,
          points: val.getPoints()
        };
      };
      var sort = function(val) {
        return - val.points;
      };
      return _.chain(players).map(convert).sortBy(sort).value();
    }
  };
})();
