var $ = require('jquery');

module.exports = {
    newMatch : function(team1, team2){

        //$.post('/match', { team1: team1, team2: team2}).done(function(data){
        //    console.log('post request completed');
        //});

        $.ajax({
            type: 'POST',
            url: 'match',
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify({ team1: team1, team2: team2}),
            success: function(value){
                console.log('success');
                console.log(value);
            },
            dataType: 'json'
        }).done(function(reply){
            console.log(reply);
        });
    }
}
