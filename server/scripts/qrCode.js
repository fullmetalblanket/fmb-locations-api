const QRCode = require('qrcode');
const aws = require('./aws');

function create(url) {
  return new Promise((resolve, reject) => {
    QRCode.toDataURL(url)
      .then(dataURI => resolve(dataURI))
      .catch(err => reject(err))
  }) 
}

function upload(image, number) {
  const buff = new Buffer(image.replace(/^data:image\/\w+;base64,/, ""),'base64')
  const params = {
    ACL: 'public-read',
    Bucket: 'matchmaker420',
    Body: buff,
    ContentEncoding: 'base64',
    ContentType: 'image/png',
    Key: `qrcodes/qrcode-${number}.png`
  }
  return aws.upload(params)
    .then((aws) => {
      return aws
    })
    .catch(error => error);
}

module.exports = {
  create,
  upload
}