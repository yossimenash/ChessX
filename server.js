var express = require('express');
var fs = require('fs');
var http = require('http');
var bodyParser = require('body-parser');

var consts = require('./config.js').consts;

var dbUtils = require('./server/database.js');
var routes = require('./server/routes.js');

console.log(new Date());

var expressServer = express();

expressServer.use(bodyParser({ limit: consts.limitSizeForPost + 'mb' }));

dbUtils.setupDB(consts, function() {
  routes.setupRoutes(expressServer, dbUtils, consts);

  expressServer.use(express.static(__dirname + '/public'));
  var server = http.createServer(expressServer);

  server.listen(consts.SERVER_PORT, null ,null, function() {
    console.log('Express server listening on port %d', consts.SERVER_PORT);
  });
});
