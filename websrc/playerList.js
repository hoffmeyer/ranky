var listTpl = require('../tpl/playerList.hbs'),
    model = require('./model.js');

module.exports = function(){
    return {
        update: function(changes){
            var playerListContainer = document.getElementById('playerList');
            playerListContainer.innerHTML = listTpl(model.players);
        }
    };
}();
