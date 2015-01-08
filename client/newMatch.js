var formUtil = require('./util/formUtil'),
    controller = require('./controller.js');

module.exports = function() {
    var tpl = require('../tpl/newMatch.hbs'),
        newMatchContainer = document.getElementById('addMatch');

    newMatchContainer.innerHTML = tpl();

    var t1p1Input = document.getElementById('newMatch-team1-player1'),
        t1p2Input = document.getElementById('newMatch-team1-player2'),
        t1Score  = document.getElementById('newMatch-team1-score'),
        t2p1Input = document.getElementById('newMatch-team2-player1'),
        t2p2Input = document.getElementById('newMatch-team2-player2');
        t2Score  = document.getElementById('newMatch-team2-score'),

    document.getElementById('newMatch-btn').addEventListener('click', function(e){
        var team1, team2;

        e.preventDefault();

        team1 = {
            players: [
                +t1p1Input.value,
                +t1p2Input.value
            ],
            score: +t1Score.value
        };

        team2 = {
            players: [
                +t2p1Input.value,
                +t2p2Input.value
            ],
            score: +t2Score.value
        };

        controller.newMatch(team1, team2);
        formUtil.clearInputs(t1p1Input, t1p2Input, t1Score, t2p1Input, t2p2Input, t2Score);
    });

}();
