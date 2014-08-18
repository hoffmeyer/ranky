var _ = require('underscore')._;
module.exports = (function() {
  'use strict';

  var validateMatchEvent = function(event) {
    var hasTeams          = event.team1 && event.team2,
        scoresAreInts     = event.team1.score === parseInt(event.team1.score) &&  event.team2.score === parseInt(event.team2.score),
        scoresArePositive = event.team1.score > 0 && event.team2.score > 0,
        hasDuplicates     = (event.team1.players.length + event.team2.players.length) === _.uniq(event.team1.players.concat(event.team2.players)).length;
        // TODO also check that the players exists

    if(hasTeams &&
       scoresAreInts &&
       scoresArePositive &&
       hasDuplicates) {
      return true;
    }
    return false;
  };

  var validatePlayerEvent = function(event) {
    if(event.playerName){
      return true;
    }
    return false;
  };

  return {
    validateEvent: function(event) {
      switch(event.type){
        case 'createPlayerEvent':
          return validatePlayerEvent(event);
        case 'registerMatchEvent':
          return validateMatchEvent(event);
        default:
          console.log('Unknown event received in event validator: ' + JSON.stringify(event));
          return false;
      }
    }
  };
})();
