var _ = require('underscore')._;
module.exports = (function() {
  'use strict';

  var validateMatchEvent = function(event) {
    var hasTeams          = event.team1 && event.team2,
        scoresArePositive = event.team1.score >= 0 && event.team2.score >= 0,
        hasDuplicates     = (event.team1.players.length + event.team2.players.length) === _.uniq(event.team1.players.concat(event.team2.players)).length;
        // TODO also check that the players exists

    if(hasTeams &&
       scoresArePositive &&
       hasDuplicates) {
      return true;
    }
    console.log('hasTeams: ' + hasTeams);
    console.log('scoresArePositive: ' + scoresArePositive);
    console.log('hasDuplicates: ' + hasDuplicates);
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
        case 'createPlayer':
          return validatePlayerEvent(event);
        case 'registerMatch':
          return validateMatchEvent(event);
        default:
          console.log('Unknown event received in event validator: ' + JSON.stringify(event));
          return false;
      }
    }
  };
})();
