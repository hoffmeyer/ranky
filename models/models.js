'use strict';
module.exports = (function(){

  var InvalidParameterException = {
    message: 'invalid points, must be a positive number',
    name: 'InvalidParameterException'
  };

  return {
    // outer self called function for wrapping nextId, which keeps track of the Id's of the players
    createPlayer: (function() {

      var nextId = 1;

      // inner function which is the one returned from createPlayer
      return function(spec) {
        var points = spec.initialScore,
            lostGames = 0,
            wonGames = 0,
            currentWinsInRow = 0,
            currentLossesInRow = 0,
            mostWinsInRow = 0,
            mostLossesInRow = 0;

        var updateRunningScore = function(won) {
          if(won) {
            wonGames++;
            currentWinsInRow++;
            if(currentLossesInRow > mostLossesInRow) {
              mostLossesInRow = currentLossesInRow;
            }
            currentLossesInRow = 0;
          } else {
            lostGames++;
            currentLossesInRow++;
            if(currentWinsInRow > mostWinsInRow) {
              mostWinsInRow = currentWinsInRow;
            }
            currentWinsInRow = 0;
          }
        };

        // when the function returned from createPlayer is invoked it returns the new player model object
        return {
          id: nextId++,
          name: spec.name,
          addPoints: function(gainedPoints) {
            if(!isNaN(gainedPoints) && gainedPoints > 0) {
              updateRunningScore(true);
              points += gainedPoints;
            }
            else{
              throw InvalidParameterException;
            }
          },
          subtractPoints: function(lostPoints) {
            if(!isNaN(lostPoints) && lostPoints > 0) {
              updateRunningScore(false);
              points -= lostPoints;
            }
            else{
              throw InvalidParameterException;
            }
          },
          getPoints: function(){
            return points;
          },
          toJSON: function() {
            return {
              id: this.id,
              name: this.name,
              gamesPlayed: lostGames + wonGames,
              points: points,
              lostGames: lostGames,
              wonGames: wonGames,
              mostWinsInRow: mostWinsInRow,
              mostLossesInRow: mostLossesInRow
            };
          }
        };
      };
    })()
  };

})();
