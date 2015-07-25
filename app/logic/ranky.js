var validator = require('../logic/validator.js'),
    util = require('util'),
    eventBus = require('../logic/eventBus.js')(),
    rankListModule = require('../modules/RankList.js'),
    scoringEngineModule = require('../modules/ScoringEngine.js'),
    broadcastModule = require('../modules/broadcaster.js'),
    dbClient;


module.exports = function(io, db, connString){
'use strict';
    db.connect(connString, function(err, client, done){
        if(err){
            console.error('Could not connect to database for insertion using connString ' + connString, err);
        } else {
            console.log("Connected correctly to server for new events");
            dbClient = client;
            client.query('SELECT * from events', function(err, result) {
                if(err){
                    console.error('Error when querying db', err);
                } else {
                    console.log('Query run successfully');
                }
            });
            //dbEvent = db.collection('events');
        }
    });
    var storeEvent = function(event) {
        if(dbClient) {
            dbClient.query('INSERT INTO EVENTS (ID, DATA) VALUES (' + event.id + ', \'' + JSON.stringify(event) + '\')', function(err, result){
                if(err){
                    console.error('Inserting event failed', err);
                } else {
                    console.log('Event saved');
                }
            });
        }
    };

    // setup modules
    rankListModule(eventBus);
    scoringEngineModule(eventBus);
    broadcastModule(eventBus, io);

    return {
        validateEvent: function(event) {
            return validator.validateEvent(event);
        },
        handleEvent: function(event, isStorable) {
            if(isStorable){
                console.log('storing event');
                storeEvent(event);
            }
            return eventBus.post(event.type, event);
        }
    };
};
