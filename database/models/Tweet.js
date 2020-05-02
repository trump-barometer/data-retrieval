// ----- Required modules -----

const mongoose = require('mongoose');


// ----- Tweets Schema -----

const tweetsSchema = new mongoose.Schema
(
    {
        tweet:
        {
            type: Object,
            required: true
        },

        modifiedDate:
        {
            type: Date,
            required: true,
            default: Date.now
        },

        creationDate:
        {
            type: Date,
            required: true,
            default: Date.now
        }
    }
);


// ------ Export Modul ------

module.exports = mongoose.model('Tweet', tweetsSchema);