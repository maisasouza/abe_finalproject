'use strict';
var express = require('express'),
    cors = require('cors'),
    bodyparser = require('body-parser'),
    server = express();

server.use(cors());
server.use(bodyparser.json());
server.use(bodyparser.urlencoded({ extended: true }));

server.listen(3000);

console.log('API Atacadista listening to port 3000...');

var routes = require('./routes');
routes(server);


server.get('/teste', function(req, res) {

});