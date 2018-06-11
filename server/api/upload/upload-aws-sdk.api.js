/**
 * we are going to upload file to s3 via node js by using
 * aws-sdk - required
 * busboy -  required
 * uuid - optional - for image renaming purpose
 * with this library you can upload any kind of file to s3 via node js.
 */

const AWS = require('aws-sdk');
// const UUID = require('uuid/v4');
const Busboy = require('busboy');
const config = require('../../config/config');
const { accessKeyId, secretAccessKey, region } = config.AWSConfig;
AWS.config.update({ accessKeyId, secretAccessKey });
const S3 = new AWS.S3();



module.exports = function(app) {
    /**
     * route where we get multipart form data
     * capture file and upload files to s3
     * 
     */
    app.post("/upload-aws", (req, res) => {
        let chunks = [], fname, ftype, fEncoding;
        let busboy = new Busboy({ headers: req.headers });
        busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
            console.log('File [' + fieldname + ']: filename: ' + filename + ', encoding: ' + encoding + ', mimetype: ' + mimetype);
            fname = filename.replace(/ /g,"_");
            ftype = mimetype;
            fEncoding = encoding;
            file.on('data', function(data) {
                // you will get chunks here will pull all chunk to an array and later concat it.
                console.log (chunks.length);
                chunks.push(data)
            });
            file.on('end', function() {
                console.log('File [' + filename + '] Finished');
            });
        });
        busboy.on('finish', function() {
            // const userId = UUID();
            const params = {
                Bucket: 'BUCKET_NAME', // your s3 bucket name
                // Key: `${userId}-${fname}`, 
                Key: `${fname}`, 
                Body: Buffer.concat(chunks), // concatinating all chunks
                ACL: 'public-read',
                ContentEncoding: fEncoding, // optional
                ContentType: ftype // required
            }
            // we are sending buffer data to s3.
            S3.upload(params, (err, s3res) => {
                if (err){
                res.send({err, status: 'error'});
                } else {
                res.send({data:s3res, status: 'success', msg: 'Image successfully uploaded.'});
                }
            });
            
        });
        req.pipe(busboy);
    });
}