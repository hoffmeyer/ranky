var morgan = require('morgan');

exports.apiLogger = (function(){
    if(process.env.NODE_ENV === 'development'){
        return morgan('dev');
    } else {
        return morgan('combined');
    }
})();

// other loggers go here
