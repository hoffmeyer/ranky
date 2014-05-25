module.exports = (function(){
  'use strict';

  var nextPlayerId  = 1,
      players       = {};

  // TODO: should be moved to model module
  var player = (function() {
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
      subtractPoints: function(newPoints) {
        if(!isNaN(newPoints) && newPoints > 0) {
          points -= newPoints;
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

  return {
    newPlayer: function(name) {
      var newPlayer = Object.create(player);
      newPlayer.name = name;
      newPlayer.id = nextPlayerId++;
      players[newPlayer.id] = newPlayer;
      return newPlayer;
    },
    getPlayers: function() {
      // TODO: sort by score
      return players;
    },
    initDummyData: function() {
      this.newPlayer('Flemming');
      this.newPlayer('Jens');
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
