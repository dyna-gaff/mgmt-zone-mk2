const request = require('request');
const fs = require('fs');
const API_URI = process.env.TEST_API_URI;
const API_KEY = process.env.TEST_API_KEY;

module.exports= {
  /*---------------------------------------------------------------------
   |  Method createManagementZone
   |
   |  Purpose:  The function will take an array of [Application, ApplicationService] and create a management zone looking at the entities
   |            tagged with the Application(key):Application(value) into a Managment Zone named Application Service. For example [2020 Cap,OA - 2020 Cap - PROD]
   |
   |  Pre-condition:  Ideally the Application Service will be in a format that will not break string reading as there is no sanitization and teh data is assumed to be sane. There also is a hard
   |                  limitation to the number of managemetn zones that can be created for any given environment. This will NOT check to see that the environment is within that limitation. 
   |
   |  Post-condition: [What we can expect to exist or be true after
   |      this method has executed under the pre-condition(s).]
   |
   |  Parameters:
   |      applicationPairingEntry -- [Explanation of the purpose of this
   |          parameter to the method.  Write one explanation for each
   |          formal parameter of this method.]
   |
   |  Returns:  [If this method sends back a value via the return
   |      mechanism, describe the purpose of that value here, otherwise
   |      state 'None.']
   *-------------------------------------------------------------------*/
  createManagementZone: function (applicationPairingArray) {

    return new Promise ((resolve)=>
      {
      const url = `https://${API_URI}/api/v2/settings/objects`;
  
      const jsonBody = 
      [
        {
          "schemaId":"builtin:management-zones",
          "schemaVersion":"1.0.12",
          "scope":"environment",
          "value":
          {
            "name":`${applicationPairingArray[1]}`,
            "description":"Application "+ applicationPairingArray[0] +" entities. Initial deployment, data gathered from the WWT2 Cleansed deliverable. [PROTO]",
            "rules":
            [
              {"enabled":true,"type":"SELECTOR","entitySelector":"type(\"SERVICE\"),tag(\"Application:"+ applicationPairingArray[0]+ "\")"},
              {"enabled":true,"type":"SELECTOR","entitySelector":"type(\"PROCESS_GROUP\"),tag(\"Application:"+ applicationPairingArray[0]+ "\")"},
              {"enabled":true,"type":"SELECTOR","entitySelector":"type(\"HOST\"),tag(\"Application:"+ applicationPairingArray[0]+ "\")"},
              {"enabled":true,"type":"SELECTOR","entitySelector":"type(\"CUSTOM_APPLICATION\"),tag(\"Application:"+ applicationPairingArray[0]+ "\")"},
              {"enabled":true,"type":"SELECTOR","entitySelector":"type(\"MOBILE_APPLICATION\"),tag(\"Application:"+ applicationPairingArray[0]+ "\")"},
              {"enabled":true,"type":"SELECTOR","entitySelector":"type(\"HTTP_CHECK\"),tag(\"Application:"+ applicationPairingArray[0]+ "\")"},
              {"enabled":true,"type":"SELECTOR","entitySelector":"type(\"SYNTHETIC_TEST\"),tag(\"Application:"+ applicationPairingArray[0]+ "\")"},
              {"enabled":true,"type":"SELECTOR","entitySelector":"type(\"PROCESS_GROUP_INSTANCE\"),tag(\"Application:"+ applicationPairingArray[0]+ "\")"},
              {"enabled":true,"type":"SELECTOR","entitySelector":"type(\"APPLICATION\"),tag(\"Application:"+ applicationPairingArray[0]+ "\")"}
            ]
          }
        }
      ]   
      request(
          {
              headers: {
                  'accept': 'application/json; charset=utf-8',
                //--API TOKEN--
                  'Authorization': `Api-Token ${API_KEY}`,
                //-------------
                  'Content-Type': 'application/json; charset=utf-8',
              },
              uri: url,
              method: 'POST',
              json: jsonBody,
              timeout: 5000,
          }, (error, response, body) => {
              // console.log(`INSIDE THE FUNCTION`);
              // console.log(`Target: ${singleEntityID}, jsonBody: ${JSON.stringify(jsonBody)}, Status Code: ${response.statusCode}`);
              if (!error && response.statusCode == 200){
                    fs.appendFile('./logs/mgmtZone-success.log', `[INFO] ${new Date().toLocaleString()},  SUCCESS,  Application: ${applicationPairingArray[0]}, ApplicationService: ${applicationPairingArray[1]}\n`, function (err) {
                      if (err) throw err;
                      //console.log(`Wrote to success log for`);
                    });
                    resolve(); 
              }
              else{
                //console.log(`[ERROR] ${new Date().toLocaleString()},  FAILED, Application: ${applicationPairingArray[0]}, ApplicationService: ${applicationPairingArray[1]}`);
                fs.appendFile('./logs/mgmtZone-error.log', `[ERROR] ${new Date().toLocaleString()},  FAILED, Application: ${applicationPairingArray[0]}, ApplicationService: ${applicationPairingArray[1]};\n`, function (err) {
                  if (err) throw err;
                });
                resolve();
              }
          }
        );
      
    });
  },
  tester: function () {
    console.log("Export complete")
  }
};





// const createManagementZone = function (applicationPairingArray){

//   return new Promise ((resolve)=>
//     {
//     const url = `https://${API_URI}/api/v2/settings/objects`;

//     const jsonBody = 
//     [
//       {
//         "schemaId":"builtin:management-zones",
//         "schemaVersion":"1.0.12",
//         "scope":"environment",
//         "value":
//         {
//           "name":`${applicationPairingArray[1]}`,
//           "description":"A management zone that will contain entities that are tagged with an Application "+ applicationPairingArray[0] +" tag for an Application Service. Data gathered from the WWT2 Cleansed deliverable. [PROTO]",
//           "rules":
//           [
//             {"enabled":true,"type":"SELECTOR","entitySelector":"type(\"SERVICE\"),tag(\"Application:"+ applicationPairingArray[0]+ "\")"},
//             {"enabled":true,"type":"SELECTOR","entitySelector":"type(\"PROCESS_GROUP\"),tag(\"Application:"+ applicationPairingArray[0]+ "\")"},
//             {"enabled":true,"type":"SELECTOR","entitySelector":"type(\"HOST\"),tag(\"Application:"+ applicationPairingArray[0]+ "\")"},
//             {"enabled":true,"type":"SELECTOR","entitySelector":"type(\"CUSTOM_APPLICATION\"),tag(\"Application:"+ applicationPairingArray[0]+ "\")"},
//             {"enabled":true,"type":"SELECTOR","entitySelector":"type(\"MOBILE_APPLICATION\"),tag(\"Application:"+ applicationPairingArray[0]+ "\")"},
//             {"enabled":true,"type":"SELECTOR","entitySelector":"type(\"HTTP_CHECK\"),tag(\"Application:"+ applicationPairingArray[0]+ "\")"},
//             {"enabled":true,"type":"SELECTOR","entitySelector":"type(\"SYNTHETIC_TEST\"),tag(\"Application:"+ applicationPairingArray[0]+ "\")"},
//             {"enabled":true,"type":"SELECTOR","entitySelector":"type(\"PROCESS_GROUP_INSTANCE\"),tag(\"Application:"+ applicationPairingArray[0]+ "\")"},
//             {"enabled":true,"type":"SELECTOR","entitySelector":"type(\"APPLICATION\"),tag(\"Application:"+ applicationPairingArray[0]+ "\")"}
//           ]
//         }
//       }
//     ]   
//     request(
//         {
//             headers: {
//                 'accept': 'application/json; charset=utf-8',
//               //--API TOKEN--
//                 'Authorization': `Api-Token ${API_KEY}`,
//               //-------------
//                 'Content-Type': 'application/json; charset=utf-8',
//             },
//             uri: url,
//             method: 'POST',
//             json: jsonBody,
//             timeout: 5000,
//         }, (error, response, body) => {
//             // console.log(`INSIDE THE FUNCTION`);
//             // console.log(`Target: ${singleEntityID}, jsonBody: ${JSON.stringify(jsonBody)}, Status Code: ${response.statusCode}`);
//             if (!error && response.statusCode == 200){
//                   fs.appendFile('./logs/mgmtZone.log', `[INFO] ${new Date().toLocaleString()},  SUCCESS  ${JSON.stringify(response)} \n`, function (err) {
//                     if (err) throw err;
//                     //console.log(`Wrote to success log for`);
//                   });
//                   resolve(); 
//             }
//             else{
//               fs.appendFile('./logs/mgmtZone.log', `[ERROR] ${new Date().toLocaleString()},  FAILED ;\n`, function (err) {
//                 if (err) throw err;
//                 console.log(`Wrote to error log. \n Response information: ${JSON.stringify(response)}`);
//               });
//               resolve();
//             }
//         }
//       );
    
//   });
// }
