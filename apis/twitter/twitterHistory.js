// ----- Required Modules -----

const Twitter = require('twitter');

const tweets = require('../../database/tweets');

// Common Functions
const common = require('../../common/common');


// ----- Twitter -----

let tweetsCount = 0;
let totalNumberOfRequests = 0;
let requestAttemptsInRow = 0;

GetLatestTweet();


// ----- Private Funtcions -----

function GetLatestTweet()
{
    var client  = new Twitter
    ({
        consumer_key: process.env.TW_CONSUMER_KEY,
        consumer_secret: process.env.TW_CONSUMER_SECRET,
        access_token_key: process.env.TW_ACCESS_TOKEN_KEY,
        access_token_secret: process.env.TW_ACCESS_TOKEN_SECRET
    });
    totalNumberOfRequests++;
    requestAttemptsInRow++;

    client.get('statuses/user_timeline', { screen_name: process.env.TW_ACCOUNT_NAME, count: '1' }, (err, receivedTweets, res) =>
    {
        if(err)
        {
            common.Log('Twitter API Error', err);
            return;
        }

        if (receivedTweets.length < 1 && requestAttemptsInRow > 10)
        {
            common.Log('Twitter API Error', 'No tweets received');
            return;
        } else if (receivedTweets.length < 1){
            GetLatestTweet();
        }

        requestAttemptsInRow = 0;
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
    var client  = new Twitter
    ({
        consumer_key: process.env.TW_CONSUMER_KEY,
        consumer_secret: process.env.TW_CONSUMER_SECRET,
        access_token_key: process.env.TW_ACCESS_TOKEN_KEY,
        access_token_secret: process.env.TW_ACCESS_TOKEN_SECRET
    });
    totalNumberOfRequests++;
    requestAttemptsInRow++;

    common.Log('Info', `Receiving tweets.. (attempt: ${requestAttemptsInRow}) (totalRequests: ${totalNumberOfRequests}) (maxTweetID: ${maxId})`);
    client.get('statuses/user_timeline', { screen_name: process.env.TW_ACCOUNT_NAME, tweet_mode: 'extended', exclude_replies: true, count: 200, max_id: maxId }, async (err, receivedTweets, res) =>
    {
        if(err)
        {
            common.Log('Twitter API Error', err);
            return;
        }

        let receivedTweetsLength = receivedTweets.length;
        requestAttemptsInRow = receivedTweetsLength > 0 ? 0 : requestAttemptsInRow;

        if(tweetsCount > 3199 || totalNumberOfRequests > 100 || requestAttemptsInRow > 20)
        {
            common.Log('Info', `Received tweets: ${tweetsCount}`);
            return;
        }

        receivedTweets.forEach(entry =>
        {
            entry.created_at = common.ConvertTwitterTimestamp(entry.created_at).toUTCString();
            entry.created_at_date = new Date(common.ConvertTwitterTimestamp(entry.created_at).toISOString);
        });

        await tweets.Store(receivedTweets);

        common.Log('Info', `Tweets retrieved (count: ${receivedTweetsLength}) (sum: ${tweetsCount})`);
        
        let newMaxId = receivedTweetsLength == 0 ? maxId : receivedTweets[receivedTweetsLength-1].id_str;

        if (newMaxId)
        {
            if (receivedTweetsLength == 1 && maxId === newMaxId && totalNumberOfRequests > 5){
                common.Log('Info', `Received tweets: ${tweetsCount}`);
                return;
            }
            tweetsCount += receivedTweetsLength;
            GetHistoricalTweets(newMaxId);
        }
        else
        {
            common.Log('Twitter API Error', 'Unable to parse new tweet id');
        }
    });
};