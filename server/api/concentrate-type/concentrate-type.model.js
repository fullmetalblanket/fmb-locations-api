var mongoose = require('mongoose');

var concentrateTypeSchema = mongoose.Schema({

  name: String

});

var ConcentrateType = mongoose.model('ConcentrateType', concentrateTypeSchema);

module.exports = ConcentrateType;
