// ----- Required Modules -----

const errors = require('restify-errors');

const Tweets = require('../database/models/Tweet');


// ----- Module Exports -----

module.exports = server =>
{
    server.get('/tweets', async (req, res, next) =>
    {
        try
        {
            const tweets = await Tweets.find({});
        
            res.send(tweets);

            next();
        }
        catch (err)
        {
            return next(new errors.InvalidContentError(err));
        }
    });

    server.get('/tweets/:id', async (req, res, next) =>
    {
        let id = req.params.id;

        if (isNaN(id))
            return next(new errors.InvalidContentError(`Given id ${id} is not number.`))

        id = Number(id);

        Tweets.findOne({ 'tweet.id' : id })
            .then(tweet =>
            {
                if (!tweet)
                    return next(new errors.ResourceNotFoundError(`There is no tweet with the id of ${id}.`))

                res.send(tweet);

                next();
            })
            .catch(err => next(new errors.InvalidContentError(err)));            
    });
}