// ----- Required Modules -----
const axios = require("axios");

const indize = require('../../database/indizes');

// Common Functions
const common = require('../../common/common');

function getindizes(symbol,indexName){
    axios.get("https://fmpcloud.io/api/v3/historical-chart/1hour/"+symbol+"?apikey=472592063245119edefb81a952944752").then(responseData => { 
      timezone = 
      indexObj = responseData["data"]
      
      for (i = 0; i < indexObj.length; i++) { 
         
        indexObj[i]["Timezone"] = "US/Eastern"
        indexObj[i]["Index"] = indexName
        
        
          
          

};
console.log(indexObj)
indize.Store(indexObj);
        
});


  };
  getindizes("^DJI","Dow Jones Average 30")
  getindizes("^GSPC","S&P 500")