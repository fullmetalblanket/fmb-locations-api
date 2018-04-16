var mongoose = require('mongoose');

var extractionMethodSchema = mongoose.Schema({

  name: String

});

var ExtractionMethod = mongoose.model('ExtractionMethod', extractionMethodSchema);

module.exports = ExtractionMethod;
