
module.exports = function(){
    var listTpl = require('../tpl/playerList.hbs'),
        model = require('./model.js');
    return {
        update: function(changes){
            var playerListContainer = document.getElementById('playerList');
            playerListContainer.innerHTML = listTpl(model.players);
        }
    };
}();
