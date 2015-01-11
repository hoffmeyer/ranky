var playerList = require('../playerList.js'),
    newMatch = require('../newMatch.js');

module.exports = function(element){

    var updateContent = function() {
        var url = window.location.hash.substr(1),
            view;

        switch(url){
            case 'newMatch':
                view = newMatch;
                break;
            default:
                view = playerList;
                break;
        }
        view(element);
    };

    window.onpopstate = function(){
        updateContent();
    };

    updateContent();
};
