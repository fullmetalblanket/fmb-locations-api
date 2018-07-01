var mongoose = require('mongoose');

var testTypeSchema = mongoose.Schema({

  name: String

});

var TestType = mongoose.model('TestType', testTypeSchema);

module.exports = TestType;
