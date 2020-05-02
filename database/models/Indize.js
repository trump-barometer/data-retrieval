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
        }
    }
);


// ------ Export Modul ------

module.exports = mongoose.model('Indize', indizesSchema);