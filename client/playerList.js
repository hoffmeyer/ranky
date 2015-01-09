var model = require('./model.js'),
    observe = require('observe-js');

module.exports = function(element){
    var listTpl = require('../tpl/playerList.hbs'),
        playerObserver = new observe.ArrayObserver(model.players);

    var update = function(){
        element.innerHTML = listTpl(model.players);
    }
    update()
    playerObserver.open(update);
};
