// ----- Required Modules -----

// Environment variables
require('dotenv').config();

const restify = require('restify');

// MongoDb Database
const mongoose = require('mongoose');

// Common Functions
const common = require('./common/common');


// ----- REST API -----

// Create REST API server
const server = restify.createServer();


// Middleware
server.use(restify.plugins.bodyParser());

// Start REST API sever
server.listen(process.env.REST_PORT, () =>
{
    // Init database
    mongoose.connect(process.env.DATABASE_URL, { useUnifiedTopology: true, useNewUrlParser: true });
});

// Mongoose connection
const db = mongoose.connection;

// MongoDB error event
db.on('error', (err) =>
{
    common.Log('Database error', err);
});

// MongoDB open event
db.once('open', () =>
{
    // Register REST API routes
    require('./routes/tweets')(server);
    require('./routes/indizes')(server);

    common.Log('Info', 'Successfully connected to database');
    common.Log('Info', `Server startet on port ${process.env.REST_PORT}`);

    // ----- Init Data -----

    // Load historical twitter data
    require('./apis/twitter/twitterHistory');

    // Load historical indizes data
    require('./apis/indizes/historicalIndizes');
});


// ----- Timers -----

// Start Twitter timer
require('./apis/twitter/twitter');

// Start Indize timers
require('./apis/indizes/alphavantage');
require('./apis/indizes/fmpcloud');