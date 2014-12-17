
module.exports = function(){
    Handlebars = require('hbsfy/runtime');

    Handlebars.registerHelper('inc', function(i){
        return i+1;
    });

}();
