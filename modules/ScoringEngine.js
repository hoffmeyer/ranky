var _ = require('underscore')._;

module.exports = function(bus){
    'use strict';
    var getDistribution = function(score1, score2) {
        var scoreDiff = Math.abs(score1 - score2);
        if(scoreDiff == 0) return 0.50;
        if(scoreDiff <= 25) return 0.51;
        if(scoreDiff <= 50) return 0.53;
        if(scoreDiff <= 75) return 0.54;
        if(scoreDiff <= 100) return 0.56;
        if(scoreDiff <= 150) return 0.59;
        if(scoreDiff <= 200) return 0.61;
        if(scoreDiff <= 250) return 0.64;
        if(scoreDiff <= 300) return 0.67;
        if(scoreDiff <= 350) return 0.69;
        if(scoreDiff <= 400) return 0.72;
        if(scoreDiff <= 450) return 0.74;
        if(scoreDiff <= 500) return 0.76;
        if(scoreDiff <= 600) return 0.80;
        if(scoreDiff <= 700) return 0.83;
        if(scoreDiff <= 800) return 0.86;
        if(scoreDiff <= 900) return 0.89;
        if(scoreDiff <= 1000) return 0.91;
        if(scoreDiff <= 1100) return 0.93;
        if(scoreDiff <= 1200) return 0.94;
        if(scoreDiff <= 1300) return 0.95;
        if(scoreDiff <= 1400) return 0.96;
        if(scoreDiff <= 1500) return 0.97;
        if(scoreDiff <= 1700) return 0.98;
        return 1;
    }

    var sumTeamPoints = function(team) {
        return team.players.reduce(
                function(acc, player){ return player.getPoints()}
        ,0 );
    };

    var transferPoints = function(toTeam, fromTeam, points) {
        var scores = {};
        _.each(toTeam.players, function(elem) {scores[elem.id] = points;});
        _.each(fromTeam.players, function(elem) {scores[elem.id] = -points;});
        return scores;
    };

    var scoreMatch = function(event) {
        var points = 50,
            itsADraw = event.team1.score === event.team2.score,
            team1TotalPoints = sumTeamPoints(event.team1),
            team2TotalPoints = sumTeamPoints(event.team2),
            distribution = getDistribution(team1TotalPoints, team2TotalPoints),
            pointsInPlay,
            favouriteTeam,
            underdog,
            favouriteTeamIsWinner;

        if(team1TotalPoints > team2TotalPoints) {
            favouriteTeam = event.team1;
            underdog = event.team2;
        } else {
            favouriteTeam = event.team2;
            underdog = event.team1;
        }

       favouriteTeamIsWinner = favouriteTeam.score > underdog.score;

        if(itsADraw){
            return transferPoints(favouriteTeam, underdog, 0)
        } else if (favouriteTeamIsWinner){
            pointsInPlay = points * (1 - distribution);
            return transferPoints(favouriteTeam, underdog, pointsInPlay)
        } else {
            pointsInPlay = points * distribution;
            return transferPoints(underdog, favouriteTeam, pointsInPlay)
        }
    };

    bus.listen('scoreMatch', function(event){
        event.deferred.resolve(scoreMatch(event));
    });
};
