var mongoose = require('mongoose'),
  Schema = mongoose.Schema;
var ObjectId  = Schema.Types.ObjectId;

var orderSchema = mongoose.Schema({

  user: { type: ObjectId, ref: 'User' }, // purchaser id
  date: Date,

  // pending
  // if seller has not set default acceptance for buyer or product
  // or default payment type is NOT COD
  // or seller has not accepted requested payment type
  // or buyer has not accepted amended payment type
  //
  // accepted
  // if all payment types have been accepted
  //
  // paid
  // order payment has been accepted by seller
  //
  // canceled
  // if buyer or seller cancels order
  order_status: String, // pending [or null], accepted, paid, canceled

  // delivery information
  //
  // set by app as 'out for delivery' when at least one product has delivery_status set (not null)
  // set by app as 'delivered' when all products have delivery_status === 'delivered'
  // ['out for delivery', 'delivered']
  delivery_status: String,
  // set by app when all order products received
  delivered_date: Date,
  // set if all order products have been canceled
  canceled: {
    date: Date,
    user: { type: ObjectId, ref: 'User' }
  },

  shipping_address: {
    address_line_1: String,
    address_line_2: String,
    city: String,
    default: Boolean,
    nickname: String,
    state: String,
    zip: String
  },

  // buyer selects from options during checkout-address
  delivery_time: String,

  products: [
    {
      _id: false, // don't use id in db

      product: { type: ObjectId, ref: 'Product' }, // populated product

      seller: { type: ObjectId, ref: 'User'},
      metadata: {
        seller_name: String,
        user_type: String
      },
      count: Number,
      name: String,
      price: Number,
      previousPrice: [
        {
          date: Date,
          price: Number
        }
      ], // if seller changes price, store previous prices in case we need to reference them
      unit_size: String,

      product_grow_method: { type: ObjectId, ref: 'ProductGrowMethod' }, // indoor, outdoor, hydroponic, sun house
      product_class: { type: ObjectId, ref: 'ProductClass' }, // indica, sativa, hybrid, cbd
      product_type: { type: ObjectId, ref: 'ProductType' }, // flowers, concentrates, edibles, prerolls, vaporizers

      // delivery information
      //
      // seller sets delivery_status to 'out for delivery' - TODO: when??
      // buyer sets delivery_status to 'delivered' when product received
      delivery_status: String,
      delivered_date: Date,

      // payment is now per product
      payment: {
        payment_type: { type: ObjectId, ref: 'PaymentType' }, // COD, Net 14, Net 30, Net 60, Credit Card
        // once payment types accepted for all products,
        // order_status = accepted
        accepted: Boolean, // payment type accepted or not
        // if seller denies initial payment terms, alternative type lives here
        // if buyer accepts amended terms, this gets removed or set to null
        // when accepted gets set to true
        alternative: { type: ObjectId, ref: 'PaymentType' },

        // seller must mark order as paid
        // how to enforce this?
        paid: {
          date: Date,
          signed_by: String
        },

        // if credit card, get billing address info
        card_type: String,
        cardholder_name: String,
        card_number: String,
        address_line_1: String,
        address_line_2: String,
        card_expiration: String,
        city: String,
        state: String,
        zip: String
      },

      // when an order is canceled we're really just canceling
      // products since an order can have multiple sellers
      // when all order products are canceled the order is canceled
      canceled: {
        date: Date,
        user: { type: ObjectId, ref: 'User' } // user who canceled
      },

      // gets set when product is marked as delivered (delivered_date is not null)
      // or when purchaser (manufacturer) creates a new product listing using this product
      // used for tracking, queries and sorting
      new_product: { type: Object, ref: 'Product' }
    }
  ],

  // TODO: deprecated - calculating summary using order products to remove a potential discrepancy
  // TODO: between calculated and stored summary
  summary: {
    subtotal: Number,
    tax: Number,
    total: Number
  }

});

var Order = mongoose.model('Order', orderSchema);

module.exports = Order;
