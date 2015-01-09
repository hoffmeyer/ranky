var playerList = require('../playerList.js'),
    newMatch = require('../newMatch.js');

module.exports = function(element){
    playerList(element);
    window.onpopstate = function(){
        var url = window.location.hash.substr(1),
            view;

        switch(url){
            case 'newMatch':
                view = newMatch;
                console.log('newMatch');
                break;
            default:
                view = playerList;
                console.log('playerList');
                break;
        }
        view(element);
    };
};
