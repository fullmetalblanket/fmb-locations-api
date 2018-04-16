var mongoose = require('mongoose');

var certificationTypeSchema = mongoose.Schema({

  name: String

});

var CertificationType = mongoose.model('CertificationType', certificationTypeSchema);

module.exports = CertificationType;
