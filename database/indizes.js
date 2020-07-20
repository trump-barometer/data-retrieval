// ----- Required Modules -----

const Indize = require('./models/Indize');

// Common Functions
const common = require('../common/common');


// ----- Public Functions -----

async function Store(indizes)
{
    if (!indizes)
        return;

    for(let indize of indizes)
    {
        try
        {
           let indi = await Indize.findOne({ $and: [ { 'indize.symbol' : indize.symbol }, { 'indize.timestamp' : indize.timestamp } ] });
        
            // Indize doesnt't exist in database
            if (!indi)
            {
                indi = new Indize({ indize });

                await indi.save(function(err, i)
                {
                    if (err)
                        throw err;
                });
            }
            else
            {
                indi.modifiedAt = Date.now();

                await indi.save(function(err, i)
                {
                    if (err)
                        throw err;
                });
            }
        }
        catch(err)
        {
            common.Log('Database error', err);
        }
    }
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