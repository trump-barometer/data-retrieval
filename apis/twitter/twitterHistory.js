// ----- Required Modules -----

const Twitter = require('twitter');

const tweets = require('../../database/tweets');

// Common Functions
const common = require('../../common/common');


// ----- Twitter -----

let client;
let tweetsCount = 0;

GetLatestTweet();


// ----- Private Funtcions -----

function GetLatestTweet()
{
    client  = new Twitter
    ({
    consumer_key: process.env.TW_CONSUMER_KEY,
    consumer_secret: process.env.TW_CONSUMER_SECRET,
    access_token_key: process.env.TW_ACCESS_TOKEN_KEY,
    access_token_secret: process.env.TW_ACCESS_TOKEN_SECRET
    });
    client.get('statuses/user_timeline', { screen_name: process.env.TW_ACCOUNT_NAME, count: '1' }, (err, receivedTweets, res) =>
    {
        if(err)
        {
            common.Log('Twitter API Error', err);
            return;
        }

        if (receivedTweets.length < 1)
        {
            common.Log('Twitter API Error', 'No tweets received');
            return;
        }

        let tweetIdString = receivedTweets[0].id_str;

        if (tweetIdString)
        {
            common.Log('Info', `Recent tweet id: ${tweetIdString}`);

            GetHistoricalTweets(tweetIdString);
        }
     });
};

function GetHistoricalTweets(maxId)
{
    client  = new Twitter
    ({
    consumer_key: process.env.TW_CONSUMER_KEY,
    consumer_secret: process.env.TW_CONSUMER_SECRET,
    access_token_key: process.env.TW_ACCESS_TOKEN_KEY,
    access_token_secret: process.env.TW_ACCESS_TOKEN_SECRET
    });
    client.get('statuses/user_timeline', { screen_name: process.env.TW_ACCOUNT_NAME, tweet_mode: 'extended', exclude_replies: true, count: '200', max_id: String(maxId) }, async (err, receivedTweets, res) =>
    {
        if(err)
        {
            common.Log('Twitter API Error', err);
            return;
        }

        let receivedTweetsLength = receivedTweets.length;

        if(receivedTweetsLength < 1)
        {
            common.Log('Info', `Received tweets: ${tweetsCount}`);
            return;
        }

        receivedTweets.forEach(entry =>
        {
            entry.created_at = common.ConvertTwitterTimestamp(entry.created_at).toUTCString();
        });

        await tweets.Store(receivedTweets);

        common.Log('Info', `Tweets retrieved (count: ${receivedTweetsLength})`);
        
        let maxTweetIdString = receivedTweets[receivedTweetsLength-1].id_str;

        if (maxTweetIdString)
        {
            let newMaxId = Number(maxTweetIdString);

            tweetsCount += receivedTweetsLength;

            GetHistoricalTweets(newMaxId);
        }
        else
        {
            common.Log('Twitter API Error', 'Unable to parse new tweet id');
        }
    });
};