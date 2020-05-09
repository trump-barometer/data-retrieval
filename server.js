// ----- Required Modules -----

// Environment variables
require('dotenv').config();

const restify = require('restify');

// MongoDb Database
const mongoose = require('mongoose');

// Common Functions
const common = require('./common/common');


// ----- REST API -----

const server = restify.createServer();


// Middleware
server.use(restify.plugins.bodyParser());

server.listen(process.env.REST_PORT, () =>
{
    // Init database
    mongoose.connect(process.env.DATABASE_URL, { useUnifiedTopology: true, useNewUrlParser: true });
});

const db = mongoose.connection;

db.on('error', (err) =>
{
    common.Log('Database error', err);
});

db.once('open', () =>
{ 
    require('./routes/tweets')(server);
    common.Log('Info', 'Successfully connected to database');
    common.Log('Info', `Server startet on port ${process.env.REST_PORT}`);
});


// ----- Timers -----

// Start Twitter timer
//require('./apis/twitter/twitter');

// Start Index
require('./apis/kurse/DAX');