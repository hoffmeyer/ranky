var pg = require('pg'),
<<<<<<< HEAD
    Q = require('q'),
    events = require('../events/events.js');

module.exports = function(conString, ranky){
=======
    Q = require('q');

module.exports = function(conString){
>>>>>>> f99e9307aecb405dc8fee525e524ef4f1770f218

  var initialize = function(){
    var deferred = Q.defer();
    var client = new pg.Client(conString);
    client.connect(function(err) {
      if(err) {
        console.error('Could not connect to database to migrate data', err);
        deferred.reject( new Error('Could not connect to database to migrate data'));
      }
      client.query('CREATE TABLE IF NOT EXISTS EVENTS( ID    INT NOT NULL PRIMARY KEY, DATA    JSON )', function(err, result){
        if(err) {
          console.error('Failed to create table events');
          deferred.reject( new Error('Failed to create table events'));
        }
        client.end();
        console.log('Data migration complete');
        deferred.resolve();
      });
    });
    return deferred.promise;
  }

  var loadEvents = function(){
    var deferred = Q.defer();
    var client = new pg.Client(conString);
    client.connect(function(err) {
      if(err) {
        console.error('Could not connect to database to load events', err);
        deferred.reject( new Error('Could not connect to database to load events'));
      }
      client.query('SELECT * FROM events', function(err, result){
          if(err){
              console.error('Error running query', err);
              deferred.reject( new Error('Error running query'));
          }
          console.log('Queried ' + result.rows.length + ' events from database.');
          console.log( 'Applying events...');
          var i = 0;
          // function for chaining the events to roll them on synchronously
          var loadEvent = function(event){
              events.setNextId(event.id+1);
              i++;
              ranky.handleEvent(event).then(function(){
                  if(i < result.rows.length){
                      loadEvent(result.rows[i].data);
                  } else {
                      console.log('Loaded ' + i + ' events from db');
<<<<<<< HEAD
                      deferred.resolve();
=======
                      startHttpServer();
>>>>>>> f99e9307aecb405dc8fee525e524ef4f1770f218
                  }
              });
          };
          if(result.rows && result.rows.length > 0){
              loadEvent(result.rows[0].data);
          } else {
            client.end();
            deferred.resolve();
          }
      });
    });
    return deferred.promise;
  }

  return {
    initialize: initialize,
    loadEvents: loadEvents
  }
};
