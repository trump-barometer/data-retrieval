// ----- Required Modules -----

const errors = require('restify-errors');

const Indizes = require('../database/models/Indize');


// ----- Module Exports -----

module.exports = server =>
{
    server.get('/indizes', async (req, res, next) =>
    {
        try
        {
            const indizes = await Indizes.find({});
        
            res.send(indizes);

            next();
        }
        catch (err)
        {
            return next(new errors.InvalidContentError(err));
        }
    });

    server.get('/indizes/:symbol', async (req, res, next) =>
    {
        let symbol = req.params.symbol;

        if (!symbol)
            return next(new errors.InvalidContentError(`No symbol given.`))

        Indizes.find({ 'indize.symbol' : symbol })
            .then(indize =>
            {
                if (!indize)
                    return next(new errors.ResourceNotFoundError(`There is no indize with the symbol of ${symbol}.`))

                res.send(indize);

                next();
            })
            .catch(err => next(new errors.InvalidContentError(err)));            
    });


    server.get('/indizes/:symbol/:timestamp', async (req, res, next) =>
    {
        let symbol = req.params.symbol;
        let timestamp = req.params.timestamp;

        if (!symbol)
            return next(new errors.InvalidContentError(`No symbol given.`))

        if (!timestamp)
            return next(new errors.InvalidContentError(`No timestamp given.`))

        Indizes.findOne({ $and: [ { 'indize.symbol' : symbol }, { 'indize.timestamp' : timestamp } ] })
            .then(indize =>
            {
                if (!indize)
                    return next(new errors.ResourceNotFoundError(`There is no indize with the symbol of ${symbol} and the timestamp of ${timestamp}.`))

                res.send(indize);

                next();
            })
            .catch(err => next(new errors.InvalidContentError(err)));
    });
}