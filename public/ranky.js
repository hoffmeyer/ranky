/* global $:false */
/* global io:false */
window.onload = function() {

    'use strict';
    var socket = io();

    socket.on('playerUpdated', function(msg){
        console.log(msg);
    });

    var updateList = function(list) {
        var $table = $('.ranklist'),
        rows = [];

        $.each(list, function(index, player){
            rows[index] = '<tr class="playerRow"><td>' + 
                player.name + '</td><td>' + 
                player.points + '</td></tr>';
        });
        $table.find('.tableRow').remove();
        $table.append(rows.join(''));
    };

    var addMatch = function() {
        var player1 = $('.player1').val(),
            player2 = $('.player2').val(),
            score1 = $('.score1').val(),
            score2 = $('.score2').val(),
            match = {
                team1: {
                    players: [player1],
                    score: score1
                },
                team2: {
                    players: [player2],
                    score: score2
                }
            };
            console.log(match);
        $.post('match', JSON.stringify(match), function(data){
            console.log('Match registered');
            console.log(data);
        });
    };

    $('.addMatchBtn').click(function(){
        addMatch();
    });

    $.ajax('list').done(function(data){
        updateList(data);
    });
};
