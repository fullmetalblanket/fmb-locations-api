const cron = require('node-cron');
const soap = require('soap');
const request = require('request');
const QRCode = require('qrcode');

const mm420Api = require('../../api/mm420-api');
// const config = require('../../config/config');
const certificate = require('../../scripts/certificate');
const aws = require('../../scripts/aws');

const processRawLabData = require('./processRawLabData')
const tempLabData = require('./lab.json');
const exampleLabData = require('./MM420exampleWithSampleAttributes.json')
const stateEmail = 'bcc@dca.ca.gov';

function startJob() {
  console.info('\nfetch-xlims startJob');
  var tenSeconds = "*/10 * * * * *"
  var thirtySeconds = "*/30 * * * * *"
  var oneMinute = "*/60 * * * * *"
  var tenMinutes = "* */10 * * * *"
  // var cronJob = cron.schedule(oneMinute, function(){
    // perform operation e.g. GET request http.get() etc.
    console.info('\nfetch-xlims startJob cronJob');
    queryforData()
      .then(data => {
        // console.log('data',data.length)
        for (let i = 0; i < data.length; i++) {
          const thisData = data[i];
          let processedData = {};
          processData(thisData)
            .then(data => processedData = data)
            // // create and upload qr code
            // .then(() => createQRCode(processedData))
            // .then(image => {
            //   processedData.qrcodeDataURL = image
            //   return uploadQRCode(image, processedData)
            // })
            // .then(aws => processedData.qrcodeURL = aws.Location)
            // .then(() => createCertificate(processedData))
            // .then(pdf => uploadCertificate(pdf, processedData))
            // // // save to database
            // // .then(aws => emailCertificate(aws, processedData))         
            // .then(data => {
            //   console.log(`job ${i} finished`)
            //   console.log('data')
            //   // console.log(`data ${JSON.stringify(data)}\n`)
            // })
            .catch(error => {
              console.log('job error B',error)
            });
        }
      })
      .catch(error => {
        console.log('job error A',error)
      })
  // }); 
  // cronJob.start();
}

function queryforData() {

  return new Promise((resolve,reject) => {
    const rawLabData = {}
    const error = {status: 'oops'}
    resolve(tempLabData)
    // reject(error)
  })

  // const rawLabData = {}
  // processData(rawLabData);
  // var url = 'http://ws.cdyne.com/emailverify/Emailvernotestemail.asmx?wsdl';
  // var args = {email: "admin@matchmaker420.com", LicenseKey: 0};

  // soap.createClient(url, function(err, client) {
  //   if (err) console.log('fetch-xlims createClient err',err);
  //   // console.info('fetch-xlims createClient client',client);
  //   client.AdvancedVerifyEmail(args, function(err, result) {
  //     console.info('fetch-xlims AdvancedVerifyEmail result',result);
  //     processData({"data": new Date()})
  //   });
  //   client.VerifyMXRecord(args, function(err, result) {
  //     console.info('fetch-xlims VerifyMXRecord result',result);
  //     processData({"data": new Date()})
  //   });
  // });
}

function processData(rawLabData) {
  // console.info('fetch-xlims rawLabData = tempLabData', tempLabData);
  // const processedData = rawLabData;
  return new Promise((resolve,reject) => {
    const processedData = processRawLabData(exampleLabData);
    resolve(rawLabData)
  })
}

function sampleName(string) {
  return string.replace(' ', '-').toLowerCase()
}

function createQRCode(data) {
  const url = `http://cblabs.us/test-results/${sampleName(data.samplename)}-${data.sampleid}`
  // const url = `https://cblabstesting.com/test-results/${sampleName(data.samplename)}-${data.sampleid}`
  // const url = `http://cblabstesting.com`
  return new Promise((resolve, reject) => {
    QRCode.toDataURL(url)
      .then(dataURI => resolve(dataURI))
      .catch(err => reject(err))
  }) 
}

function uploadQRCode(image, data) {
  const buff = new Buffer(image.replace(/^data:image\/\w+;base64,/, ""),'base64')
  const params = {
    ACL: 'public-read',
    Bucket: 'matchmaker420',
    Body: buff,
    ContentEncoding: 'base64',
    ContentType: 'image/png',
    Key: `qrcodes/qrcode-${data.sampleid}.png`
  }
  // upload it
  return aws.upload(params)
    .then((aws) => {
      return aws
    })
    .catch(error => error);
}

function createCertificate(data) {
  return certificate.create(data)
    .then(doc => doc)
    .catch(error => error);
}

function uploadCertificate(certificate, data) {
  const params = {
    ACL: 'public-read',
    Bucket: 'matchmaker420',
    Body: certificate,
    ContentType: 'application/pdf',
    Key: `certificates/certificate-${data.sampleid}.pdf`
  }
  // upload it
  return aws.upload(params)
    .then((aws) => {
      return aws
    })
    .catch(error => error)
}

function emailCertificate(aws, data) {
  const payload = {
    from: 'admin@matchmaker420.com',
    to: data.client_email,
    subject: `Certificate for ${data.samplename} - ${data.sampleid}`,
    attachments: [
      {
        filename: `certificate-${data.sampleid}`,
        path: aws.Location,
        cid: `certificate-${data.sampleid}`
      }
    ]
  }
  return new Promise((resolve, reject) => {
    request.post(mm420Api.requestOptions({url:'/email-pdf'}, payload), function(error, response, data) {
      if (!error && response.statusCode == 200) {
        resolve(data)
      }
      reject(error)
    });
  });
}


module.exports.startJob = startJob;