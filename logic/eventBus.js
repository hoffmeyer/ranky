var _ = require('underscore')._,
    Q = require('q');

module.exports = function() {
    'use strict';

    var listeners = {};

    return {
        listen: function(eventType, listener){
            if(!listeners[eventType]) {
                listeners[eventType] = [];
            }
            listeners[eventType].push(listener);
        },
        post: function(eventType, event) {
            event.deferred = Q.defer();
            _.each(listeners[eventType], function(listener) {
                listener(event);
            });
            return event.deferred.promise;
        },
    };
};
