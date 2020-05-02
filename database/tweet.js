// ----- Required Modules -----

const Tweet = require('./models/Tweet');


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
                    tw = new Tweet
                    (
                        {
                            tweet
                        }
                    );
                }
                else
                {
                    tw.modifiedDate = Date.now();
                }                
                
                tw.save()
                    .then(t =>
                    {
                        console.log(`Tweet saved to database : ${t.id}`);
                    })
                    .catch(err => console.log(`Database error : ${err}`));
            });           
    });
}


// ------ Export Modul ------

module.exports =
{
    Store
};