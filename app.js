// initialize app
var express = require('express'),
    bodyParser = require('body-parser'),
    routes = require('./routes/routes.js'),
    app = express();

app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use('/', routes);

// start server
var server = app.listen(3000, function() {
  'use strict';
  console.log('Listening on port %d', server.address().port);
});
