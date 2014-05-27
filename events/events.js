module.exports = (function(){
  'use strict';

  var nextId = 1;
  // TODO: make genereal function that creates a basic event with id and datetime

  return {
    setNextId: function(newId){
      if(newId > nextId) {
        nextId = newId;
      } else {
        console.log('new nextId for events must be greater than old id');
      }
    },
    createPlayer: function(name) {
      return {
        id: nextId++,
        type: 'createPlayerEvent',
        playerName: name
      }
    },
    registerMatch: function(player1Id, score1, player2Id, score2){
      return {
        id: nextId++,
        type: 'registerMatchEvent',
        player1Id:  player1Id,
        score1:     score1,
        player2Id:  player2Id,
        score2:     score2
      };
    }
  };

})();
