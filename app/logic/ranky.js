var validator = require('../logic/validator.js'),
    util = require('util'),
    eventBus = require('../logic/eventBus.js')(),
    rankListModule = require('../modules/RankList.js'),
    scoringEngineModule = require('../modules/ScoringEngine.js'),
    broadcastModule = require('../modules/broadcaster.js'),
    dbEvent;


module.exports = function(io, db, connString){
'use strict';
    db.connect(connString, function(err, client, done){
        if(err){
            console.error('Could not connect to database for insertion using connString ' + connString, err);
        } else {
            console.log("Connected correctly to server for new events");
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
        dbEvent.insertOne(event, function( err, doc) {
            if (err) {
                console.err('Insertion of event failed');
                console.trace(err);
            } else {
                console.log('event saved');
            }
        });
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
