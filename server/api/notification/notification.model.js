var mongoose = require('mongoose'),
  Schema = mongoose.Schema;
var ObjectId  = Schema.Types.ObjectId;

var NotificationSchema = mongoose.Schema({

  user: { type: ObjectId, ref: 'User'}, // subscriber
  generated: Date,
  read: Date,
  // title: String,

  // every notification has an associated message
  message: { type: ObjectId, ref: 'Message'},

  // optional
  product_subscription: { type: ObjectId, ref: 'ProductSubscription'}

});

var Notification = mongoose.model('Notification', NotificationSchema);

module.exports = Notification;
