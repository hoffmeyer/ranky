
module.exports = (function(){
  'use strict';

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
        var points = spec.initialScore;

        // when the function returned from createPlayer is invoked it returns the new player model object
        return {
          id: nextId++,
          name: spec.name,
          addPoints: function(gainedPoints) {
            if(!isNaN(gainedPoints) && gainedPoints > 0) {
              points += gainedPoints;
            }
            else{
              throw InvalidParameterException;
            }
          },
          subtractPoints: function(lostPoints) {
            if(!isNaN(lostPoints) && lostPoints > 0) {
              points -= lostPoints;
            }
            else{
              throw InvalidParameterException;
            }
          },
          getPoints: function(){
            return points;
          }
        };
      };
    })()
  };

})();
