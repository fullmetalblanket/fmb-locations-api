const AWS = require('aws-sdk');
const config = require('../config/config');
const { accessKeyId, secretAccessKey, region } = config.AWSConfig;
AWS.config.update({ accessKeyId, secretAccessKey, region });
const s3 = new AWS.S3();

function upload(params) {
  // function upload(params, data) {
  // console.log('\naws-> params', params)
  // console.log('\naws-> data', data)
  return new Promise((resolve,reject) => {
    s3.upload(params, (err, response) => {
      if (err) reject(err)
      resolve(response)
    });
  })
}

module.exports.upload = upload