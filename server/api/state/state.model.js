var mongoose = require('mongoose');

var stateSchema = mongoose.Schema({

  idx: String,
  name: String,
  country_id: String

});

var State = mongoose.model('State', stateSchema);

module.exports = State;
