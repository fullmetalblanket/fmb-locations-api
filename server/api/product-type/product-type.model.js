var mongoose = require('mongoose');

var productTypeSchema = mongoose.Schema({

  name: String

});

var ProductType = mongoose.model('ProductType', productTypeSchema);

module.exports = ProductType;
