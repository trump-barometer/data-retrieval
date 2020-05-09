// ----- Required Modules -----
const axios = require("axios");

const indize = require('../../database/indizes');

// Common Functions
const common = require('../../common/common');

function getindizes(symbol){
    axios.get("https://www.alphavantage.co/query?function=TIME_SERIES_intraday&interval=60min&symbol="+symbol+"&apikey=DOEHQNU1CVASTXPD").then(responseData => { 
      timezone = responseData['data']['Meta Data']['6. Time Zone']
      indexObj = responseData["data"]["Time Series (60min)"]
      var i =0
      Object.keys(indexObj).forEach(key => {
        var datestring = String(key)
        
        indexObj[datestring]["6. _id"] = datestring
        indexObj[datestring]["7. Timezone"] = timezone
        indexObj[datestring]["8. Index"] ="PDAX"
        indexObj2 = indexObj[key]
        Object.keys(indexObj2).forEach(key2 =>
          {
              key3 = key2.substring(3)
              Object.defineProperty(indexObj2, key3,
                  Object.getOwnPropertyDescriptor(indexObj2, key2));
              delete indexObj2[key2];
          
          })
          
          

});
indize.Store(indexObj);
        
});


  };
  setTimeout(getindizes,100,'^GDAXI')
//getindizes('^GDAXI')
  
