// ----- Required Modules -----
const axios = require("axios");

const indize = require('../../database/indizes');

// Common Functions
const common = require('../../common/common');


// ----- Dow Jones Average 30 -----

GetIndize('^DJI');

// setInterval(GetIndize, 1000 * 60 * 60, '^DJI');

// ----- S&P 500 -----

GetIndize('^GSPC');

// setInterval(GetIndize, 1000 * 60 * 60, '^GSPC');


// ----- Private Funtcions -----

function GetIndize(symbol)
{
    const avKey = process.env.SC_API_KEY;
    const interval = 1;
    const url = `https://fmpcloud.io/api/v3/historical-chart/${interval}hour/${symbol}?apikey=${avKey}`;

    axios.get(url)
        .then(res =>
        {
            let timeInterval = '60min';

            res.data.forEach(entry =>
            {
                entry.timestamp = entry.date;
                entry.symbol = symbol;
                entry.interval = timeInterval;
                delete entry.date;
            });

            indize.Store(res.data);
        })
        .catch(err => common.Log('Indize error', err));
}