var _     = require('underscore')._;

module.exports = (function() {
  'use strict';

  return {
    score: function(team1, team2) {
      var scores = {};
      if(team1.players.length > 0 && team2.players.length > 0) {
        var points = 25;
        if(team1.score > team2.score) {
          _.each(team1.players, function(elem) {scores[elem.id] = points;});
          _.each(team2.players, function(elem) {scores[elem.id] = -points;});
        } else {
          _.each(team1.players, function(elem) {scores[elem.id] = -points;});
          _.each(team2.players, function(elem) {scores[elem.id] = points;});
        }
        return scores;
      } else {
        throw {
          message: 'Unknown player received player1Id; ' + event.player1Id + ' player2Id: ' + event.player2Id,
          name: 'InvalidPlayerIdException'
        };
      }
      }
  };
})();
