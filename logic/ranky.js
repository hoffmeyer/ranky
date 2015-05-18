var validator = require('../logic/validator.js'),
    dbUri = process.env.MONGOLAB_URI || 'mongodb://localhost:27017/ranky2',
    mongoClient = require('mongodb').MongoClient,
    eventBus = require('../logic/eventBus.js')(),
    rankListModule = require('../modules/RankList.js'),
    scoringEngineModule = require('../modules/ScoringEngine.js'),
    broadcastModule = require('../modules/broadcaster.js'),
    testDataGeneratorModule = require('../modules/testDataGenerator.js'),
    dbEvent;


module.exports = function(io){
'use strict';
    mongoClient.connect(dbUri, function(err, db) {
        if(err){
            console.err('Could not connect to database for insertion');
            console.trace(err);
        } else {
           console.log("Connected correctly to server for insertion");
           dbEvent = db.collection('events');
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
    testDataGeneratorModule(eventBus);

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
