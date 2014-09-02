/* global $:false */
/* global io:false */
window.onload = function() {

    'use strict';
    var socket = io(),
        list;

    var sortList = function() {
        list.sort(function(a,b){
            return b.points - a.points;
        });
    }

    var updateList = function() {
        var $table = $('.ranklist'),
        rows = [];

        sortList();
        $.each(list, function(index, player){
            rows[index] = '<tr class="playerRow"><td style="text-align: right;">' + 
                player.id + '</td><td>' + 
                player.name + '</td><td>' + 
                player.points + '</td></tr>';
        });
        $table.find('.playerRow').remove();
        $table.append(rows.join(''));
    };

    var updatePlayer = function(newPlayer){
        $.each(list, function(index, oldPlayer){
            if(newPlayer.id == oldPlayer.id){
                    list[index] = newPlayer;
            }
        });
    }

    socket.on('playerUpdated', function(msg){
        $.each(msg, function(index, player){
            updatePlayer(player);
        });
        updateList();
    });

    socket.on('playerCreated', function(player){
        list.push(player);
        updateList();
    });


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
        $.ajax({
            type: 'POST',
            url: '/match',
            data: JSON.stringify(match),
            success: function(data) {console.log(data);},
            contentType: 'application/json'
        });
    };

    var createPlayer = function() {
        var playerName = $('.playername').val(),
            player = {
                name: playerName
            }

        $.ajax({
            type: 'POST',
            url: '/player',
            data: JSON.stringify(player),
            success: function(data) {
                console.log(data);
                updatePlayer(player);
                updateList();
            },
            contentType: 'application/json'
        });
    };

    $('.addMatchBtn').click(function(){
        addMatch();
    });

    $('.createPlayerBtn').click(function(){
        createPlayer();
        $('.playername').val('').focus();
        
    });

    $.ajax('list').done(function(data){
        list = data;
        updateList();
    });
};
