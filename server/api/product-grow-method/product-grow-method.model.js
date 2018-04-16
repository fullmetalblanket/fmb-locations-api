var mongoose = require('mongoose');

var productGrowMethodSchema = mongoose.Schema({

  name: String

});

var ProductGrowMethod = mongoose.model('ProductGrowMethod', productGrowMethodSchema);

module.exports = ProductGrowMethod;
