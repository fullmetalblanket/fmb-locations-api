var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
var ObjectId  = Schema.Types.ObjectId;

var ProductSubscriptionSchema = mongoose.Schema({

  user: { type: ObjectId, ref: 'User'}, // subscriber
  product: { type: ObjectId, ref: 'Product'}, // product
  message: { type: ObjectId, ref: 'Message'}, // message
  // notification: { type: ObjectId, ref: 'Notification'} // notification

  // this is for a "soft delete"
  deleted: Boolean

});

var ProductSubscription = mongoose.model('ProductSubscription', ProductSubscriptionSchema);

module.exports = ProductSubscription;
