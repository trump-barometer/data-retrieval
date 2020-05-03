// ----- Required Modules -----

const Tweet = require('./models/Tweet');

// Common Functions
const common = require('../common/common');


// ----- Public Functions -----

function Store(tweets)
{
    if (!tweets)
        return;

    tweets.forEach(tweet =>
    {
        Tweet.findOne({ "tweet.id" : tweet.id })
            .then(async tw =>
            {
                // Tweet doesnt't exist in database
                if (!tw)
                {
                    tw = new Tweet({ tweet });

                    tw.save().then(t =>
                    {
                        common.Log('Info', `Tweet (${t.id}) saved to database`);
                    })
                    .catch(err => common.Log('Database error', err));
                }
                else
                {
                    tw.modifiedAt = Date.now();

                    tw.save().then(t =>
                    {
                        common.Log('Info', `Tweet (${t.id}) updated`);
                    })
                    .catch(err => common.Log('Database error', err));
                }
            })
            .catch(err => common.Log('Database error', err));
    });
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