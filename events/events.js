module.exports = (function(){
  'use strict';

  var nextId = 1;
  // TODO: make genereal function that creates a basic event with id and datetime

  return {
    setNextId: function(newId){
      if(newId > nextId) {
        console.log('New id set: ' + newId);
        nextId = newId;
      } else {
        console.log('newId(' + newId + ') for events must be greater than old id(' + nextId + ')');
      }
    },
    createPlayer: function(name) {
      console.log('New id set: ' + nextId);
      return {
        id: nextId++,
        type: 'createPlayerEvent',
        playerName: name
      }
    },
    registerMatch: function(team1ids, score1, team2ids, score2){
      console.log('New id set: ' + nextId);
      return {
        id: nextId++,
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
