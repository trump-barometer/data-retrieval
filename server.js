// ----- Required Modules -----

// Environment variables
require('dotenv').config();

// Init database
require('./database/mongodb');

const { fork } = require('child_process');


// ----- REST API -----




// ----- FORKS -----

// Run Twitter fork
fork('./twitter/twitter.js');

// Run Indizes fork
//fork('./twitter/twitter.js');