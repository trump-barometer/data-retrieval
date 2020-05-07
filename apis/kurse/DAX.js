// ----- Required Modules -----
const axios = require("axios");

const indize = require('../../database/indizes');

// Common Functions
const common = require('../../common/common');

function getindizes(symbol){
    axios.get("https://www.alphavantage.co/query?function=TIME_SERIES_intraday&interval=60min&symbol="+symbol+"&apikey=DOEHQNU1CVASTXPD").then(responseData => { 
        data = responseData["data"]["Time Series (60min)"]
        indize.Store(data);
        common.Log('Info', 'Indize retrieved');

})

  };
  setTimeout(getindizes,10000,'^GDAXI')
//getindizes('^GDAXI')
  
