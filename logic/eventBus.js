var _ = require('underscore')._;

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
            _.each(listeners[eventType], function(listener) {
                listener(event);
            });
        },
    };
};
