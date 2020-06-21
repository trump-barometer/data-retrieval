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

GetPotusTweets();

setInterval(GetPotusTweets, 1000 * 60 * 5);

// ----- Private Funtcions -----

function GetPotusTweets()
{
    client.get('statuses/user_timeline', { screen_name: process.env.TW_ACCOUNT_NAME, tweet_mode: 'extended' }, (err, receivedTweets, res) =>
    {
        if(err)
        {
            common.Log('Twitter API Error', err);
            return;
        }
        
        tweets.Store(receivedTweets);

        common.Log('Info', 'Tweets retrieved');
    });
}