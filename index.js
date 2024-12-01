const dotenv = require('dotenv').config();
const managementZoneCrafter = require(`./mgmtZone.js`);
const csvParser = require("csv-parse");
const { Console } = require('console');
const {exit} = require('process');
const request = require('request');
const fs = require('fs');
const { hostname } = require("os");
const API_URI = process.env.API_URI;
const API_KEY = process.env.API_KEY;
const DATA_FILE = process.env.DATA_FILE;
//---------
//---------
//****************************** */
/*     FUNCTION DECLARATIONS     */
/* readHostNames:
/*   read a csv list to get the Host names that will be sent
/* retreiveEntityInformation  
/*   get the entity information from the entites api end point by sending a host anme through the entity selector
/*                               */
/**  */
const readAppAppService = new Promise((resolve)=> {
  //2D array to contain the mapping of an application to the Application Service
  let applicationNameMap = [];
    /** Eample Data
     * Name, App Service Name
     * abc123, AGENCY - APPLICATION - ENVIRONMENT
     * abc124, AGENCY - APPLICATION - ENVIRONMENT
     * ..., ...
     */
  //This does not need a ; as the .pipe adn .on are assumed to be used on the entity below
  fs.createReadStream(`${DATA_FILE}`)
    //Delimiter is the piece it is looking for the agency-app-env.csv uses ',' as a delimiter
    //From line indicates that there is a header line for the tables so start on the second line
  .pipe(csvParser.parse({ delimiter: ",", from_line: 2 }))

  .on("data", function (row) {
   
    /*
    //We only want the first column of the data in this particular case so use row[0]
    console.log(`[INFO] ${new Date().toLocaleString()}, Pushing ${row[0]} to array.`); 
    */
    fs.appendFile('./logs/readAppAppService.log', `[INFO] ${new Date().toLocaleString()}, Pushing Application: ${row[0]}| Application Service: ${row[1]} to array.\n`, function (err) {
      if (err) throw err;
      // console.log(`Wrote to success log for ${singleEntityID}`);
    });
    applicationNameMap.push([row[0], row[1]]);
  })
  .on("end", function () {
    console.log("____FINISHED____");
    console.log(`[INFO] ${new Date().toLocaleString()}, Ending readAppAppService function, moving to resolve promise.`);
    console.log(`My information is the following; Title: ${process.title} PID: ${process.pid}`)
    //Essentially returns soemthing for the promise, in this case the list of host names.
    resolve(applicationNameMap);
  })
  .on("error", function (error) {
    console.log(`[ERROR] ${new Date().toLocaleString()}, Error: Make a better error message *winkyFace*.`);
    console.log(error.message);
  });

});

// END FUNCTION DECLARATIONS
//*************************************************** */

//.then() is waiting for the readAppAppService function to resolve before executing the asynchronous anonymous function
readAppAppService.then(async (listOfAppAppService)=>{
  //Removed displaying of all entities
  //console.log(listOfAppAppService);
  
  //The resolve contents of the retrieveEntityInformation fucntion are being set to entityInformation
  // const entityInformation = await retreiveEntityInformation(listOfHosts[0]);

  //Go through each element and pull it's information from the API
  const monitoringMode = await Promise.all(listOfAppAppService.map(async (individualAppAppservice)=>{
    return await managementZoneCrafter.createManagementZone(individualAppAppservice);
  })) 
});
// const tibby = [["AASHTOWare","MODOT - AASHTOWare - PROD"],["Abandoned Mines","DNR - Abandoned Mines - PROD"]]
// managementZoneCrafter.createManagementZone(tibby[1]);
// console.log();
//readAppService.readAppAppService();