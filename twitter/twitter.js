// ----- Required Modules -----

const Twitter = require('twitter');

const tweet = require('../database/tweet');


// ----- Twitter -----

let client = new Twitter
({
    consumer_key: process.env.TW_CONSUMER_KEY,
    consumer_secret: process.env.TW_CONSUMER_SECRET,
    access_token_key: process.env.TW_ACCESS_TOKEN_KEY,
    access_token_secret: process.env.TW_ACCESS_TOKEN_SECRET
});

client.get('statuses/user_timeline', {screen_name: 'POTUS'}, (error, tweets, response) =>
{
    if(error)
    {
        console.log(error);
        return;
    }
    
    //Tweet.deleteMany({}).catch(err => console.log(`Database error : ${err}`));

    //console.log(tweets);

    tweet.Store(tweets);
});