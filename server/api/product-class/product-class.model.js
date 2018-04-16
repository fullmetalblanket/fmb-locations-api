var mongoose = require('mongoose');

var productClassSchema = mongoose.Schema({

  name: String,
  abbr: String

});

var ProductClass = mongoose.model('ProductClass', productClassSchema);

module.exports = ProductClass;
