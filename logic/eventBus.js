'use strict';
var _ = require('underscore')._;

module.exports = (function() {

  var modules = [];

  return {
    post: function(event) {
      _.each(modules, function(module) {
        module.handle(event);
      });
    },
    register: function(module) {
      modules.push(module);
      module.setBus(this);
    }
  };
})();
