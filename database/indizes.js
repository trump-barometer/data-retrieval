// ----- Required Modules -----

const Indize = require('./models/Indize');

// Common Functions
const common = require('../common/common');


// ----- Public Functions -----

function Store(indizes)
{
    if (!indizes)
        return;

    indizes.forEach(indize =>
    {
        Indize.findOne({ $and: [ { 'indize.symbol' : indize.symbol }, { 'indize.timestamp' : indize.timestamp } ] })
            .then(async indi =>
            {
                // Indize doesnt't exist in database
                if (!indi)
                {
                    indi = new Indize({ indize });

                    indi.save().then(i =>
                    {
                        common.Log('Info', `Indize (${i.id}) saved to database`);
                    })
                    .catch(err => common.Log('Database error', err));
                }
                else
                {
                    indi.modifiedAt = Date.now();

                    indi.save().then(i =>
                    {
                        common.Log('Info', `Indize (${i.id}) updated`);
                    })
                    .catch(err => common.Log('Database error', err));
                }
            })
            .catch(err => common.Log('Database error', err));       
    });
}

function DeleteAll()
{
    Indize.deleteMany({}).then(x => common.Log('Database',  'Deleted all documents from indize collection')).catch(err => common.Log('Database error',  err));
}


// ------ Export Modul ------

module.exports =
{
    Store,
    DeleteAll
};