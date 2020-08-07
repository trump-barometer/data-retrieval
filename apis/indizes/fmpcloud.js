// ----- Required Modules -----
const axios = require("axios");

const indize = require('../../database/indizes');

// Common Functions
const common = require('../../common/common');

// ----- Dow Jones Average 30 -----

GetIndize('^DJI', process.env.SC_API_KEY_ONE);

setInterval(GetIndize, 1000 * 60 * process.env.IN_INTERVAL, '^DJI', process.env.SC_API_KEY_ONE);

// ----- Nasdaq 100 -----

GetIndize('^NDX', process.env.SC_API_KEY_TWO);

setInterval(GetIndize, 1000 * 60 * process.env.IN_INTERVAL, '^NDX', process.env.SC_API_KEY_TWO);

// ----- S&P 500 -----

GetIndize('^GSPC', process.env.SC_API_KEY_THREE);

setInterval(GetIndize, 1000 * 60 * process.env.IN_INTERVAL, '^GSPC', process.env.SC_API_KEY_THREE);

// ----- DAX -----

GetIndize('^GDAXI', process.env.SC_API_KEY_FOUR);

setInterval(GetIndize, 1000 * 60 * process.env.IN_INTERVAL, '^GDAXI', process.env.SC_API_KEY_FOUR);


// ----- Private Funtcions -----

function GetIndize(symbol, apiKey)
{
    const interval = 1;
    const url = `https://fmpcloud.io/api/v3/historical-chart/${interval}hour/${symbol}?apikey=${apiKey}`;

    axios.get(url)
        .then(async res =>
        {
            if (res.data)
            {
                res.data.forEach(entry =>
                {
                    entry.timestamp = common.ConvertIndexTimestamp(symbol, entry.date).toUTCString();
                    entry.timestamp_date = new Date(common.ConvertIndexTimestamp(symbol, entry.date).toISOString());
                    entry.symbol = symbol;
                    delete entry.date;
                });
        
                await indize.Store(res.data);

                common.Log('Info', `${res.data.length} indizes of ${symbol} retrieved`);
            }
        })
        .catch(err => common.Log('Indize error', err));
}