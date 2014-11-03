window.onload = function() {

    $('.createTestData').click(function() {
        var persist = $('#persist').prop('checked'),
            numPlayers = $('#numplayers').val(),
            numMatches = $('#numMatches').val(),
            $status = $('.status');

        $status.html();

        if(numPlayers){
            $.ajax({
                type: 'POST',
                url: '/test/generatePlayers',
                data: JSON.stringify({numPlayers: numPlayers, persist: persist}),
                success: function(data) {
                    $status.append('<p>' + numPlayers + ' players created</p>');
                },
                contentType: 'application/json'
            })
        }
        if(numMatches){
            $.ajax({
                type: 'POST',
                url: '/test/generateMatches',
                data: JSON.stringify({numMatches: numMatches, persist: persist}),
                success: function(data) {
                    $status.append('<p>' + numMatches+ ' matches played</p>');
                },
                contentType: 'application/json'
            })
        }
    });
};
