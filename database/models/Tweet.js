// ----- Required modules -----

const mongoose = require('mongoose');
const timestamp = require('mongoose-timestamp');


// ----- Tweets Schema -----

const tweetsSchema = new mongoose.Schema
(
    {
        tweet:
        {
            type: Object,
            required: true
        }
    }
);

tweetsSchema.plugin(timestamp);


// ------ Export Modul ------

module.exports = mongoose.model('Tweet', tweetsSchema);