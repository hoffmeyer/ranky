'use strict';
module.exports = (function(){

  return {
    handle: function(event) {
      switch(event.type) {
        case 'createPlayerEvent':
          console.log('handling createPlayerEvent from RanList module');
          break;
      }
    }
  };

})();
