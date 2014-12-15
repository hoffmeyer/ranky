var model = require('./model.js'),
    observe = require('observe-js'),
    playerList = require('./playerList.js');

// populate model
request = new XMLHttpRequest();
request.open('GET', '/list', true);

request.onload = function() {
  if (request.status >= 200 && request.status < 400){
    data = JSON.parse(request.responseText);
    model.players.push.apply(model.players, data);
    Platform.performMicrotaskCheckpoint();
  } else {
      console.log('An error occurred while retreiving the list');
  }
};

request.onerror = function() {
    console.log('Something went very wrong while retreiving the list');
};

request.send();

// Initialize views

// Listen for changes in model
var changed = function(changes) {
    console.log('Change observed!');
    console.log(changes);
    playerList.update(changes);
}

var playerObserver = new observe.ArrayObserver(model.players);
playerObserver.open(changed);
