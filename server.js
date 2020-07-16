// ----- Required Modules -----

// Environment variables
require('dotenv').config();

// MongoDb Database
const mongoose = require('mongoose');

// Common Functions
const common = require('./common/common');

// Init database
mongoose.connect(process.env.DATABASE_URL, { useUnifiedTopology: true, useNewUrlParser: true });

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
    common.Log('Info', 'Successfully connected to database');

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
require('./apis/indizes/fmpcloud');