const soap = require('soap');

// TEMP
const exampleLabData = require('../jobs/xlims/MM420exampleWithSampleAttributes.json');

module.exports = function() {
  // return new Promise((resolve,reject) => {
  //   const rawLabSample = {};
  //   const error = {status: 'oops'};
  //   resolve(exampleLabData);
  //   // reject(error)
  // })
  // const rawLabSample = {}
  // processSample(rawLabSample);


  return new Promise((resolve,reject) => {
    var url = 'http://ws.cdyne.com/emailverify/Emailvernotestemail.asmx?wsdl';
    var args = {email: "admin@matchmaker420.com", LicenseKey: 0};
  
    soap.createClient(url, function(err, client) {
      if (err) console.log('fetch-xlims createClient err',err);
      // console.info('fetch-xlims createClient client',client);
      client.AdvancedVerifyEmail(args, function(err, result) {
        // console.info('fetch-xlims AdvancedVerifyEmail result',result);
        // processSample({"data": new Date()})
        if (err) reject(err)
        resolve(result)
      });
      client.VerifyMXRecord(args, function(err, result) {
        // console.info('fetch-xlims VerifyMXRecord result',result);
        // processSample({"data": new Date()})
        if (err) reject(err)
        resolve(result)
      });
    });
  })


}