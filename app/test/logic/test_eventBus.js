var should = require('should'),
    bus = require('../../logic/eventBus.js')();

describe('eventBus', function() {

    describe('the eventbus should be instanciated', function() {
        it('should have a bus', function() {
            bus.should.exist;
        });
    });

    describe('listeners and post', function() {
        var event1Called = false,
            event2Called = false,
            event3Called = false;

        var function1 = function(event) {
            event1Called = true;
        };
        var function2 = function(event) {
            event2Called = true;
        };
        var function3 = function(event) {
            event3Called = true;
        };

        bus.listen('event1', function1);
        bus.listen('event1', function2);
        bus.listen('event2', function3);

        bus.post('event1', {});

        it('should have called event1 listeners, but not event2 listeners', function() {
            event1Called.should.be.ok;
            event2Called.should.be.ok;
            event3Called.should.not.be.ok;
        });
    });
});
