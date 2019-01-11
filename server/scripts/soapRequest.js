// const soap = require('soap');
const soap = require('soap-ntlm');
const fs = require('fs');
const httpntlm = require('httpntlm');
const path = require('path');

// TEMP
const exampleLabData = require('../jobs/xlims/EVERCASEexampleWithSampleAttributes.json');
const testUrl = 'http://ws.cdyne.com/emailverify/Emailvernotestemail.asmx?wsdl';

module.exports = function(options) {

  let { url, wsdlPath, username, password, args } = options;
  let { TaskGuid, Parameters } = args

  return new Promise((resolve,reject) => {

    httpntlm.get({
      url,
      username,
      password,
    }, function(err, wsdl){
      // console.log('\nwsdl',wsdl)
      const file = path.join(__dirname, 'xlims_taxonomy.wsdl');
      fs.writeFile(file, wsdl.body, function() {
        soap.createClient(file, options, function(err, client) {
          if(err){
            console.log(err);
            reject(err);
          } else {
            client.setSecurity(new soap.NtlmSecurity(username, password));
            // console.log('\nclient',client);
            console.log('\nclient',client.describe());
            client.PerformTaskByID({
              TaskGuid,
              Parameters,
            }, function(err, res){
              if (err) {
                console.log('err',err);
              } else {
                // console.log('res',JSON.stringify(res));
                if (!Object.keys(res).length) {
                  reject('no data');
                } else {
                  // console.log('\nsamples',res.PerformTaskByIDResult.NewDataSet.Table.length)
                  // console.log('\nsamples1',res.PerformTaskByIDResult.NewDataSet.Table1.length)
                  resolve(res);
                }
              }
            });
          }
        });
      });
    });





    // const testUrl = 'https://APP01USEAST@cblabs:CbL&bs!7@cblabs.xlims.net/XLIMSAPI.asmx?WSDL';
    // const httpOptions = {
    //   'auth':
    //     { 
    //         'username': 'APP01USEAST\CBLabs',
    //         'password': 'CbL&bs!7',
    //         'sendImmediately': true      
    //     }
    // };
    // soap.createClient(testUrl, httpOptions, function (err, client) {
    //   if (err) reject(err)
    //   var description = client.describe();
    //   console.log('description',JSON.stringify(description));
    //   // done();
    //   resolve(description)
    // });


    // var url = 'https://cblabs.xlims.net/XLIMSAPI.asmx';
    // // var args = {TaskGuid: "D274EB3A-CD9B-436C-91B3-86EC5043B84C", Parameters: ''};
    // var args = {Parameters:''}

    // args.TaskGuid = operation === 'get' ? 'D274EB3A-CD9B-436C-91B3-86EC5043B84C' : '306AC5CC-2616-416A-B961-7AD142258823'

    // var httpOptions = {
    //   Authorization: "Basic " + Buffer.from(username + ":" + password).toString("base64")
    // }
    // var Authorization = "Basic " + Buffer.from(username + ":" + password).toString("base64")
    // var Authorization = "NTLM " + Buffer.from(username + ":" + password).toString("base64")

    // var httpOptions = {
    //   // rejectUnauthorized: false,
    //   // strictSSL: false,
    //   // forceSoap12Headers: true,
    //   // suppressStack: true,
    //   // secureOptions: constants.SSL_OP_NO_TLSv1_2,
    //   // wsdl_headers: {
    //   //   Authorization,
    //   //   "WWW-Authenticate": Authorization
    //   // }
    //   wsdl_options: {
    //     ntlm: true,
    //     username,
    //     password
    //   }
    // }

    // console.log('\nhttpOptions',httpOptions)

    // soap.createClientAsync(url, httpOptions).then((client) => {
    //   console.log('client',client)
    //   return client.PerformTaskByID_JSONAsync(args);
    // }).then(result => {
    //   console.log('\nsoap result',result)
    //   resolve(result);
    // }).catch(err => {
    //   console.log('\nsoap err A',err)
    //   reject(err)
    // });
  


    // soap.createClient(url, httpOptions, function(err, client, body) {
    //   if (err) {
    //     console.log('\nsoap err A',err)
    //     reject(err)
    //   } else {
    //     console.log('\nsoap',soap);

    //     client.setSecurity(new soap.NTLMSecurity(options.wsdl_options));

    //     client.PerformTaskByID_JSON(args, function(err, result) {
    //       if (err) {
    //         // console.log('\nsoap err B',err)
    //         reject(err);
    //       } else {
    //         // console.log('\nsoap result',result)
    //         resolve(result)
    //       }
    //     });
    //   }
    // });

    
  })



  // return new Promise((resolve,reject) => {
  //   const rawLabSample = {};
  //   const error = {status: 'oops'};
  //   resolve(exampleLabData);
  //   // reject(error)
  // })
  // const rawLabSample = {}
  // processSample(rawLabSample);


  // return new Promise((resolve,reject) => {
  //   var url = 'http://ws.cdyne.com/emailverify/Emailvernotestemail.asmx?wsdl';
  //   var args = {email: "admin@evercase.space", LicenseKey: 0};
  
  //   soap.createClient(url, function(err, client) {
  //     if (err) console.log('soap createClient err',err);
  //     // console.info('fetch-xlims createClient client',client);
  //     client.AdvancedVerifyEmail(args, function(err, result) {
  //       // console.info('fetch-xlims AdvancedVerifyEmail result',result);
  //       // processSample({"data": new Date()})
  //       if (err) reject(err)
  //       resolve(result)
  //     });
  //     client.VerifyMXRecord(args, function(err, result) {
  //       // console.info('fetch-xlims VerifyMXRecord result',result);
  //       // processSample({"data": new Date()})
  //       if (err) reject(err)
  //       resolve(result)
  //     });
  //   });
  // })


}