var _ = require('underscore')._;
var model = require('../models/model.js');

module.exports = (function(){
  'use strict';

  var players = {};

  return {
    newPlayer: function(name) {
      var newPlayer = model.createPlayer({name: name, initialScore: 1000});
      players[newPlayer.id] = newPlayer;
      return newPlayer;
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
    },
    addMatch: function(player1Id, score1, player2Id, score2) {
      if(isNaN(score1) || isNaN(score2)) {
        throw {
          message: 'scores must be a number',
          name: 'InvalidParameterException'
        };
      }
      var player1 = players[player1Id];
      var player2 = players[player2Id];
      if(player1 && player2) {
        var points = 25;
        if(score1 > score2) {
          player1.addPoints(points);
          player2.subtractPoints(points);
        } else {
          console.log('Player ' + player2Id + ' wins');
          player1.subtractPoints(points);
          player2.addPoints(points);
        }
      } else {
        throw {
          message: 'Unknown player received',
          name: 'InvalidPlayerIdException'
        };
      }
    }
  };
})();
