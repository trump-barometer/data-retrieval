// ----- Required Modules -----

const Tweet = require('./models/Tweet');

// Common Functions
const common = require('../common/common');


// ----- Public Functions -----

async function Store(tweets)
{
    if (!tweets)
        return;

    for(let tweet of tweets)
    {
        try
        {
            let tw = await Tweet.findOne({ "tweet.id" : tweet.id });

            // Tweet doesnt't exist in database
            if (!tw)
            {
                tw = new Tweet({ tweet });

                await tw.save(function(err, t)
                {
                    if (err)
                        throw err;
                });
            }
            else
            {
                tw.modifiedAt = Date.now();

                await tw.save(function(err, t)
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
    Tweet.deleteMany({}).then(x => common.Log('Database',  'Deleted all documents from tweet collection')).catch(err => common.Log('Database error',  err));
}


// ------ Export Modul ------

module.exports =
{
    Store,
    DeleteAll
};