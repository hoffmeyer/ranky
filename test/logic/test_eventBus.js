var should = require('should'),
    bus = require('../../logic/eventBus.js');

describe('eventBus', function() {
    'use strict';
    var module1HandleCalled = false,
        module2HandleCalled = false,
        busFromModule1,
        busFromModule2,
        module1,
        module2;

    module1 = {
        setBus: function(bus){
            busFromModule1 = bus;
        },
        handle: function(event){
            module1HandleCalled = true;
        }
    };

    module2 = {
        setBus: function(bus){
            busFromModule2 = bus;
        },
        handle: function(event){
            module2HandleCalled = true;
        }
    };

    bus.register(module1);
    bus.register(module2);

    describe('register', function() {
        it('set the bus on all modules', function() {
            busFromModule1.should.be.exactly(bus, 'the bus has not been set on module1');
            busFromModule2.should.be.exactly(bus, 'the bus has not been set on module2');
        });
    });

    describe('post', function() {

        bus.post({}); // just post an empty event

        it('send the event to all registered modules', function() {
            module1HandleCalled.should.be.true;
            module2HandleCalled.should.be.true;
        });
    });
});
