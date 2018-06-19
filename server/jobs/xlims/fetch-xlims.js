const cron = require('node-cron');
const queryForData = require('../../scripts/soapRequest');
const processSample = require('../../scripts/processSample');
const qrCode = require('../../scripts/qrCode');
const certificate = require('../../scripts/certificate');

const stateEmail = 'bcc@dca.ca.gov';

function startJob() {
  console.info('\nfetch-xlims startJob');
  var tenSeconds = "*/10 * * * * *";
  var thirtySeconds = "*/30 * * * * *";
  var oneMinute = "*/60 * * * * *";
  var tenMinutes = "* */10 * * * *";
  var testURLPrefix = 'http://cblabs.us/test-results/';

  // var cronJob = cron.schedule(oneMinute, function(){
    console.info('\nfetch-xlims startJob cronJob');

    queryForData()
      .then(data => {
        const samples = data.XLIMSExport.SampleInfo;
        // for (let i = 0; i < samples.length; i++) {
        for (let i = 0; i < 1; i++) {
          const rawSample = samples[i];
          // console.log('\nrawSample',rawSample)
          let sample = {};
          processSample(rawSample)
            .then(data => sample = data)
            .then(() => sample.qrcodePageURL = `${testURLPrefix}${sampleName(sample.SampleName)}-${sample.SampleNumber}`)
            .then(() => qrCode.create(sample.qrcodePageURL))
            .then(image => sample.qrcodeDataURL = image)
            .then(() => qrCode.upload(sample.qrcodeDataURL))
            .then(aws => sample.qrcodeURL = aws.Location)
            .then(() => certificate.create(sample))
            .then(pdf => sample.certificatePDF = pdf)
            .then(() => certificate.upload(sample.certificatePDF, sample.SampleNumber))
            .then(aws => sample.certificateURL = aws.Location)

            .then(() => saveData(sample))

            // .then(aws => certificate.email(stateEmail, sampleName(sample.SampleName), sample.SampleNumber, sample.certificateURL))  
            // .then(aws => certificate.email(clientEmail, sampleName(sample.SampleName), sample.SampleNumber, sample.certificateURL))    

            .then(data => {
              // console.log(`job ${i} finished`)
              console.log('\ndata',data);
              // console.log('sample',sample)
              // console.log(`data ${JSON.stringify(data)}\n`)
            })
            .catch(error => {
              // console.log('job error B',error);
              handleError(error)
            });
        }
      })
      .catch(error => {
        // console.log('job error A',error);
        handleError(error)
      })
  // }); 
  // cronJob.start();
}

function sampleName(string) {
  return string.replace(' ', '-').toLowerCase();
}

function saveData(sample) {
  console.log('saveData',sample)
  // fetch all products by client email and see if one exists with this SampleNumber in it's { lab } object
  // if not check all other products too just to make sure? this could get expensive
  // if we do that we should store all products in memory to reduce queries? maybe update memory data once a day?
  // if product exists update it
  // if it doesn't exist create it
  // we may need to get all the product metadata from the lab until we have METRC integrated
}

function handleError(error) {
  // log errors
  console.log('xlims cron job error',error);
}

module.exports.startJob = startJob;