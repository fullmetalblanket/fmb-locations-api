var mongoose = require('mongoose');

var productUnitSchema = mongoose.Schema({

  name: String,
  abbr: String

});

var ProductUnit = mongoose.model('ProductUnit', productUnitSchema);

module.exports = ProductUnit;
