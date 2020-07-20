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
            entry.created_at = ConvertTwitterTimestamp(entry.created_at).toUTCString();
        });
        
        await tweets.Store(receivedTweets);

        common.Log('Info', `${receivedTweets.length} Tweets retrieved`);
    });
}

function ConvertTwitterTimestamp(datestring)
{
    var year = datestring.substring(datestring.length, datestring.length-4);
    var day = datestring.substring(datestring.length-20, datestring.length-22);
    var month = datestring.substring(datestring.length-23, datestring.length-26);
    var sec = datestring.substring(datestring.length-11, datestring.length-13);
    var min = datestring.substring(datestring.length-14, datestring.length-16);
    var hr = datestring.substring(datestring.length-17, datestring.length-19);
    var date = new Date(Date.parse(day + ' ' + month + ' ' + year + ' ' + hr + ':' + min + ':' + sec + ' GMT'));
    return date;
}