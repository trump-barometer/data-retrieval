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

const firstTweetId = 822521968465416192;
let tweetsCount = 0;

GetLatestPotusTweet();


// ----- Private Funtcions -----

function GetLatestPotusTweet()
{
    client.get('statuses/user_timeline', { screen_name: process.env.TW_ACCOUNT_NAME, tweet_mode: 'extended' , count: '1' }, (err, receivedTweets, res) =>
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
            let maxId = Number(tweetIdString);

            common.Log('Info', `Recent tweet id: ${tweetIdString}`);

            GetPotusHistoricalTweets(maxId);
        }
     });
};

function GetPotusHistoricalTweets(maxId)
{
    client.get('statuses/user_timeline', { screen_name: process.env.TW_ACCOUNT_NAME, tweet_mode: 'extended', exclude_replies: true, count: '200', max_id: maxId }, (err, receivedTweets, res) =>
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

        tweets.Store(receivedTweets);

        common.Log('Info', 'Tweets retrieved');
        
        let maxTweetIdString = receivedTweets[receivedTweetsLength-1].id_str;

        if (maxTweetIdString)
        {
            let newMaxId = Number(maxTweetIdString);

            tweetsCount += receivedTweetsLength;

            if(firstTweetId >= newMaxId)
            {
                common.Log('Info', `Received tweets: ${tweetsCount}`);
                return;
            }
            
            GetPotusHistoricalTweets(newMaxId);
        }        
    });
};