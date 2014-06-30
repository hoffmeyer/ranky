module.exports = (function(){
  'use strict';

  var nextId = 1;

  var createEvent = function() {
    return {
      id: nextId++,
      eventTime: new Date()
    };
  };

  return {
    setNextId: function(newId){
      if(newId > nextId) {
        nextId = newId;
      } else {
        console.log('newId(' + newId + ') for events must be greater than old id(' + nextId + ')');
      }
    },
    createPlayer: function(name) {
      var event = createEvent();
      event.type = 'createPlayerEvent';
      event.playerName = name;
      return event;
    },
    registerMatch: function(team1ids, score1, team2ids, score2){
      var event = createEvent();
      event.type = 'registerMatchEvent';
      event.team1 = {
        players: team1ids,
        score: score1
      };
      event.team2 = {
        players: team2ids,
        score: score2
      };
      return event;
    }
  };

})();
