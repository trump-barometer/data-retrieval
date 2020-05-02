// ----- Required modules -----

const mongoose = require('mongoose');
const timestamp = require('mongoose-timestamp');


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

indizesSchema.plugin(timestamp);


// ------ Export Modul ------

module.exports = mongoose.model('Indize', indizesSchema);