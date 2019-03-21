var mongoose = require('mongoose');

var countrySchema = mongoose.Schema({

  idx: String,
  name: String,
  sortname: String,
  phoneCode: String

});

var Country = mongoose.model('Country', countrySchema);

module.exports = Country;
