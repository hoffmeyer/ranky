model = require('./model.js');
observe = require('observe-js');

window.model = model;

var changed = function(changes) {
    console.log('Change observed!');
    console.log(changes);
}

var playerObserver = new observe.ArrayObserver(model.players);
playerObserver.open(changed);
