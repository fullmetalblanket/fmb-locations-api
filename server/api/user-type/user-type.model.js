var mongoose = require('mongoose');

var userTypeSchema = mongoose.Schema({

  name: String,
  prefix: [],
  description: String

});

var UserType = mongoose.model('UserType', userTypeSchema);

module.exports = UserType;
