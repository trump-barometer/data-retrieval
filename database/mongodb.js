// ----- Required modules -----

// MongoDb Database
const mongoose = require('mongoose');


// ------ MongoDB Database Init ------

mongoose.connect(process.env.DATABASE_URL, { useUnifiedTopology: true, useNewUrlParser: true });

const db = mongoose.connection;

db.on('error', (error) =>
{
    console.log(`Error: ${error}`);
});

db.once('open', () =>
{ 
    console.log('Info: Successfully connected to database.');
});


// ------ Export Modul ------

module.exports = db;