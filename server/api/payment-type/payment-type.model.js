var mongoose = require('mongoose');

var paymentTypeSchema = mongoose.Schema({

  name: String,
  description: String

});

var PaymentType = mongoose.model('PaymentType', paymentTypeSchema);

module.exports = PaymentType;
