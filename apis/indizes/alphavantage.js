// ----- Required Modules -----
const axios = require("axios");

const indize = require('../../database/indizes');

// Common Functions
const common = require('../../common/common');


// ----- DAX -----

GetIndize('^GDAXI');

// setInterval(GetIndize, 1000 * 60 * 60, '^GDAXI');

// ----- FTSE100 -----

//GetIndize('^FTSE'); 

// setInterval(GetIndize, 1000 * 60 * 60, '^FTSE');


// ----- Private Funtcions -----

function GetIndize(symbol)
{
    const avKey = process.env.AV_API_KEY;
    const interval = 60;
    const url = `https://www.alphavantage.co/query?function=TIME_SERIES_intraday&interval=${interval}min&symbol=${symbol}&apikey=${avKey}`;

    axios.get(url)
        .then(res =>
        {
            let symbol = res['data']['Meta Data']['2. Symbol'];
            let lastRefreshed = res['data']['Meta Data']['3. Last Refreshed'];
            let timeInterval = res['data']['Meta Data']['4. Interval'];
            let timezone = res['data']['Meta Data']['6. Time Zone'];

            let series = res['data'][`Time Series (${interval}min)`];

            Object.keys(series).forEach(key =>
            {
                let dateString = String(key);
                let ind = series[key];

                Object.keys(ind).forEach(k =>
                {
                    key3 = k.substring(3);
                    Object.defineProperty(ind, key3, Object.getOwnPropertyDescriptor(ind, k));
                    delete ind[k];
                });

                series[dateString]["timestamp"] = dateString;
                series[dateString]["symbol"] = symbol;
                series[dateString]["lastrefreshed"] = lastRefreshed;
                series[dateString]["interval"] = timeInterval;
                series[dateString]["timezone"] = timezone;
            });

            series = Object.keys(series).map(function (key)
            {           
                return series[key];
            });

            indize.Store(series);
        })
        .catch(err => common.Log('Indize error', err));
}