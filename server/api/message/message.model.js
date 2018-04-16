var mongoose = require('mongoose'),
  Schema = mongoose.Schema;
var ObjectId  = Schema.Types.ObjectId;

var MessageSchema = mongoose.Schema({

  user: { type: ObjectId, ref: 'User'}, // message recipient
  from: { type: ObjectId, ref: 'User'}, // message sender
  generated: Date,
  read: Date, // if not present, user has not read

  message: String,

  // append past messages here if
  // user to user message reply
  history: [
    { type: ObjectId, ref: 'Message' }
  ],

  // optional refs (there can be only one)
  product_subscription: { type: ObjectId, ref: 'ProductSubscription' },
  order_number: { type: ObjectId, ref: 'Order' },
  product: { type: ObjectId, ref: 'Product' },
  new_user: { type: ObjectId, ref: 'User' },

  // this is for a "soft delete"
  deleted: Boolean

});

var Message = mongoose.model('Message', MessageSchema);

module.exports = Message;
