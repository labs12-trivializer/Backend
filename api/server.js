// Handle async catch errors from one source.
require('express-async-errors');

//Require tiers router
const tiers = require('../routes/tiers');

const server = require('express')();

require('../middleware')(server);

// require('../routes')(server);

//Direct requests to /tiers to tiers router
server.use('/tiers', tiers);

module.exports = server;
