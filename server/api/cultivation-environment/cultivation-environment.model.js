var mongoose = require('mongoose');

var cultivationEnvironmentSchema = mongoose.Schema({

  name: String

});

var CultivationEnvironment = mongoose.model('CultivationEnvironment', cultivationEnvironmentSchema);

module.exports = CultivationEnvironment;
