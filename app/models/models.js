module.exports = (function(){
    'use strict';

    var idCounter = 0;

    var createModel = function () {
        return {
            id: ++idCounter
        }
    };

    var createPlayer = function(spec){
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

        var player = createModel();
        player.name = spec.name;
        player.addPoints = function(newPoints) {
            updateRunningScore(newPoints > 0);
            points += newPoints;
        };
        player.getPoints = function(){
            return points;
        };
        player.toJSON = function() {
            return {
                id: this.id,
                name: this.name,
                gamesPlayed: lostGames + wonGames,
                points: points,
                lostGames: lostGames,
                wonGames: wonGames,
                mostWinsInRow: mostWinsInRow,
                mostLossesInRow: mostLossesInRow,
                currentWinsInRow: currentWinsInRow,
                currentLossesInRow: currentLossesInRow
            };
        };
        player.isActive = function(){
            return lostGames + wonGames > 0;
        }
        return player;
    };

    return {
        createPlayer: createPlayer,
    };
})();
