module.exports = (function(){
  'use strict';

  var event = {
    nextId: 1,
    // common functions of events go here
  };

  return {
    setNextId: function(newId){
      if(newId > event.nextId) {
        event.nextId = newId;
      } else {
        console.log('newId(' + newId + ') for events must be greater than old id(' + event.nextId + ')');
      }
    },
    createPlayer: function(name) {
      return {
        id: event.nextId++,
        type: 'createPlayerEvent',
        playerName: name
      };
    },
    registerMatch: function(team1ids, score1, team2ids, score2){
      return {
        id: event.nextId++,
        type: 'registerMatchEvent',
        team1: {
          players: team1ids,
          score: score1
        },
        team2: {
          players: team2ids,
          score: score2
        }
      };
    }
  };

})();
