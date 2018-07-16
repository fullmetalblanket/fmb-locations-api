// var Config = require('../../config/config').AWSConfig;
// var Crypto = require('crypto');
// var CryptoJS = require('crypto-js');
// var imageDataURI = require('image-data-uri');
// var DataURI = require('datauri');
//
// var fs = require('fs');

const AWS = require('aws-sdk');
//
// AWS.config.update({
//   accessKeyId: Config.accessKey,
//   secretAccessKey: Config.secretAccessKey
// });
//
// var s3 = new AWS.S3();

module.exports = function(app) {


  // upload policy for Amazon AWS
  app.post('/get_upload_policy', function(req, res) {
    // var date = this.generateTimestamp();
    var folder = req.body.folder || req.query.folder || 'default/';
    console.log('\nget_upload_policy: image folder ', folder);

    var date = req.body.date;
    var datetime = date + 'T000000Z';

    var credential = Config.accessKey+'/'+date+'/'+Config.region+'/s3/aws4_request';

    var policy = JSON.stringify({
      "expiration": (new Date(Date.now() + 100000)).toISOString(),
      "conditions": [
        {"bucket": Config.bucket},
        ["starts-with", "$key", folder],
        {"acl": Config.acl},
        ["starts-with", "$Content-Type", "image/"],
        {"x-amz-credential": credential},
        {"x-amz-algorithm": "AWS4-HMAC-SHA256"},
        {"x-amz-date": datetime},
        ["content-length-range", 0, 5242880]
      ]
    });
    console.log('\nget_upload_policy: policy', policy);

    // var policyBase64 = window.btoa(policy);
    var policyBase64 = new Buffer(policy).toString("base64");
    console.log('\nget_upload_policy: policyBase64', policyBase64);

    var kDate = CryptoJS.HmacSHA256(date, "AWS4" + Config.secretAccessKey);
    var kRegion = CryptoJS.HmacSHA256(Config.region, kDate);
    var kService = CryptoJS.HmacSHA256("s3", kRegion);
    var kSigning = CryptoJS.HmacSHA256("aws4_request", kService);

    // var signatureKey = this.generateSignatureKey(Config.secretAccessKey, date, Config.region, "s3");
    // var signature = CryptoJS.HmacSHA256(policyBase64, signatureKey).toString(CryptoJS.enc.Hex);
    var signature = CryptoJS.HmacSHA256(policyBase64, kSigning).toString(CryptoJS.enc.Hex);
    console.log('\nget_upload_policy: signature', signature);

    // var awsKey = Config.accessKey;
    // console.log('awsKey', awsKey);
    // var awsSecret = Config.secretAccessKey;
    // console.log('awsSecret', awsSecret);
    // var policyString = JSON.stringify(policy);
    // var policyBase64 = new Buffer(policy).toString("base64");
    // var hmac = Crypto.createHmac("sha1", Config.secretAccessKey);
    // hmac.update(policyBase64);
    //
    // var signature = hmac.digest('base64');

    // console.log('\nget_upload_policy: signature', signature);

    console.log('\nget_upload_policy: policyBase64', policyBase64);
    console.log('get_upload_policy: signature', signature);
    console.log('get_upload_policy: datetime', datetime);
    console.log('get_upload_policy: credential', credential);
    console.log('get_upload_policy: bucket ', Config.bucket);

    const policyInfo = {
      policyBase64: policyBase64,
      signature: signature,
      datetime: datetime,
      credential: credential,
      bucket: Config.bucket
    };
    console.log('\nget_upload_policy: policyInfo', policyInfo);

    return res.status(200).send(policyInfo);

  });


  app.post('/upload_image', function(req, res) {

    console.log('\nupload_image', req.body);

    var myBucket = Config.bucket;

    var myKey = Config.accessKey;

    var file = fs.createReadStream(req.body);

    s3.createBucket({Bucket: myBucket}, function(err, data) {

      if (err) {

        console.log(err);

      } else {

        var params = {Bucket: myBucket, Key: myKey, Body: file};

        s3.putObject(params, function(err, data) {

          if (err) {

            res.send({"error":true});
            console.log(err)

          } else {

            console.log('Successfully uploaded data to ' + Config.bucket + '/' + Config.bucketKey);

            res.send({"success":true});
          }

        });

      }

    });
  });


  //
  // generateSignatureKey(key, dateStamp, regionName, serviceName) {
  //   var kDate = CryptoJS.HmacSHA256(dateStamp, "AWS4" + key);
  //   var kRegion = CryptoJS.HmacSHA256(regionName, kDate);
  //   var kService = CryptoJS.HmacSHA256(serviceName, kRegion);
  //   var kSigning = CryptoJS.HmacSHA256("aws4_request", kService);
  //
  //   return kSigning;
  // }


  app.get('/aws_config', function(req, res) {
    console.log('getting aws config');
    return res.send(Config);
  });



  app.get('/get_data_uri/:filename', function(req, res) {
    console.log('\nget data uri', req.params.filename);

    // console.log('fuuuuck', imageDataURI.encodeFromURL(req.params.filename));

    // RETURNS image data URI :: 'data:image/png;base64,PNGDATAURI/'
    // imageDataURI.encodeFromURL(req.params.filename, function(err, res) {
    //   return res.send({uri: res});
    // });
    // return imageDataURI.encodeFromURL(req.params.filename)
    //   .then(function(res) {
    //     return res.send({uri: res});
    //     // console.log(res);
    //   });



    var datauri = new DataURI();

    var uriToEncode = req.params.filename;
    // var uriToEncode = __dirname+'/'+req.params.filename;
    console.log('\nuriToEncode ',uriToEncode)

    datauri.encode(uriToEncode, function(err, content) {
      if (err) {
        throw err;
      }

      console.log(content); //=> "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA..."

      console.log(this.mimetype); //=> "image/png"
      console.log(this.base64); //=> "iVBORw0KGgoAAAANSUhEUgAA..."
      console.log(this.getCSS()); //=> "\n.case {\n    background-image: url('data:image/png;base64,iVBORw..."
      console.log(this.getCSS({
        class: "myClass",
        width: true,
        height: true
      })); //=> adds image width and height and custom class name

      return res.send({uri: content});
    });

  });



  // OLD upload policy for Amazon AWS
  app.get('/get_upload_policy_old', function(req, res) {
    console.log('getting upload policy', req.body);
    var folder = req.body.folder || req.query.folder || 'default/';
    var name = req.body.name || req.query.name || '';
    var expiration = new Date();
    expiration.setHours(expiration.getHours() + 1);

    var policy = {
      expiration: expiration.toISOString(),
      conditions: [
        {bucket: Config.bucket},
        ["starts-with", "$key", folder],
        {acl: Config.acl},
        ["starts-with", "$Content-Type", "image/"],
        ["content-length-range", 0, 5242880]
      ]
    };
    console.log('upload policy', policy);

    var awsKey = Config.key;
    console.log('awsKey', awsKey);
    var awsSecret = Config.secret;
    console.log('awsSecret', awsSecret);
    var policyString = JSON.stringify(policy);
    var encodedPolicyString = new Buffer(policyString).toString("base64");

    var hmac = Crypto.createHmac("sha1", awsSecret);
    hmac.update(encodedPolicyString);

    var digest = hmac.digest('base64');
    var returnObj = {awskey: awsKey, policy: encodedPolicyString, signature: digest};

    console.log('returnObj',returnObj);
    return res.status(200).send(returnObj);
  });

};

