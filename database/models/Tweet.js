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

        modifiedAt:
        {
            type: Date,
            default: Date.now,
            required: true
        },

        createdAt:
        {
            type: Date,
            default: Date.now,
            required: true
        }
    }
);

// ------ Export Modul ------

module.exports = mongoose.model('Tweet', tweetsSchema);