var mongoose = require('mongoose');

var citySchema = mongoose.Schema({

  idx: String,
  name: String,
  state_id: String

});

var City = mongoose.model('City', citySchema);

module.exports = City;
