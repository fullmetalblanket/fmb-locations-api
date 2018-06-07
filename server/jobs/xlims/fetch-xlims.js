var cron = require('node-cron');
var soap = require('soap');
// var http = require('http');

// var http_options = {
//   hostname: 'localhost',
//   port: 80,
//   path: 'http://www.SoapClient.com/xml/SQLDataSoap.wsdl',
//   method: 'POST',
//   headers: {
//     'Content-Type': 'application/x-www-form-urlencoded',
//     'Content-Length': xml.length
//   }
// }

// var req = http.request(http_options, (res) => {
//   console.log(`STATUS: ${res.statusCode}`);
//   console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
//   res.setEncoding('utf8');
//   res.on('data', (chunk) => {
//     console.log(`BODY: ${chunk}`);
//   });

//   res.on('end', () => {
//     console.log('No more data in response.')
//   })
// });

// req.on('error', (e) => {
//   console.log(`problem with request: ${e.message}`);
// });

// // write data to request body
// req.write(xml); // xml would have been set somewhere to a complete xml document in the form of a string
// req.end();

function startJob() {
  var tenSeconds = "*/10 * * * * *"
  var thirtySeconds = "*/30 * * * * *"
  var oneMinute = "*/60 * * * * *"
  var tenMinutes = "* */10 * * * *"
  var cronJob = cron.schedule(oneMinute, function(){
    // perform operation e.g. GET request http.get() etc.
    console.info('\nfetch-xlims startJob');
    queryforData();
  }); 
  // cronJob.start();
  queryforData();
}

function queryforData() {
  var url = 'http://ws.cdyne.com/emailverify/Emailvernotestemail.asmx?wsdl';
  var args = {email: "admin@matchmaker420.com", LicenseKey: 0};

  soap.createClient(url, function(err, client) {
    if (err) console.log('fetch-xlims createClient err',err);
    // console.info('fetch-xlims createClient client',client);
    client.AdvancedVerifyEmail(args, function(err, result) {
      console.info('fetch-xlims AdvancedVerifyEmail result',result);
      processData({"data": new Date()})
    });
    client.VerifyMXRecord(args, function(err, result) {
      console.info('fetch-xlims VerifyMXRecord result',result);
      processData({"data": new Date()})
    });
  });

}

function processData(data) {
  console.info('fetch-xlims processData', data);

}

module.exports.startJob = startJob;