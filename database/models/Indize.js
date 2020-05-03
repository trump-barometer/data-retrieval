// ----- Required modules -----

const mongoose = require('mongoose');


// ----- Indizes Schema -----

const indizesSchema = new mongoose.Schema
(
    {
        indize:
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

module.exports = mongoose.model('Indize', indizesSchema);