// ----- Required Modules -----

const Twitter = require('twitter');

const tweets = require('../../database/tweets');

// Common Functions
const common = require('../../common/common');


// ----- Twitter -----

let client = new Twitter
({
    consumer_key: process.env.TW_CONSUMER_KEY,
    consumer_secret: process.env.TW_CONSUMER_SECRET,
    access_token_key: process.env.TW_ACCESS_TOKEN_KEY,
    access_token_secret: process.env.TW_ACCESS_TOKEN_SECRET
});

GetTweets();

setInterval(GetTweets, 1000 * 60 * process.env.TW_INTERVAL);


// ----- Private Funtcions -----

function GetTweets()
{
    client.get('statuses/user_timeline', { screen_name: process.env.TW_ACCOUNT_NAME, tweet_mode: 'extended' }, async (err, receivedTweets, res) =>
    {
        if(err)
        {
            common.Log('Twitter API Error', err);
            return;
        }

        receivedTweets.forEach(entry =>
        {
            var ts = common.ConvertTwitterTimestamp(entry.created_at);
            entry.created_at = ts.toUTCString();
            entry.created_at_date = new Date(ts.toISOString());
        });
        
        await tweets.Store(receivedTweets);

        common.Log('Info', `${receivedTweets.length} Tweets retrieved`);
    });
}