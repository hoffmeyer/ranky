'use strict';
var _ = require('underscore')._,
    models = require('../models/models.js'),
    rankingEngine = require('../logic/rankingEngine.js');
    

module.exports = (function(){
  var players = [];

  var newPlayer = function(event) {
    var newPlayer = models.createPlayer({name: event.playerName, initialScore: 1000});
    players[newPlayer.id] = newPlayer;
    return newPlayer;
  };

  var populateTeamWithPlayers = function(team) {
    team.players = _.map(team.players, function(elem) { return players[elem];});
    return team;
  };

  var setScoresOnPlayers = function(scores) {
    _.each(scores, function(val, key) {
      if(val > 0) {
        players[key].addPoints(val);
      } else {
        players[key].subtractPoints(-val);
      }
    });
  };

  var addMatch = function(event) {
    var team1 = populateTeamWithPlayers(event.team1);
    var team2 = populateTeamWithPlayers(event.team2);
    var scores = rankingEngine.score(team1, team2);
    setScoresOnPlayers(scores);
  };

  return {
    handle: function(event) {
      switch(event.type) {
        case 'createPlayerEvent':
          var res = newPlayer(event);
          if(event.callback){
            event.callback(res);
          }
          break;
        case 'registerMatchEvent':
          addMatch(event);
          break;
      }
    }
  };

})();
