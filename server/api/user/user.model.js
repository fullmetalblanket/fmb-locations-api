var mongoose = require('mongoose'),
  Schema = mongoose.Schema;
var ObjectId  = Schema.Types.ObjectId;

var userSchema = mongoose.Schema({

  created: Date,
  last_logged_in: Date,
  terms_accepted: Boolean,

  // generated on signup, used if not using admin approval process
  activation_token: String,
  // just to keep track
  welcome_email_sent: {type: Boolean, default: false},
  // account_activated: {type: Boolean, default: false},
  // if using admin approval process
  active: {type: Boolean, default: false},

  reset_password_token: String,
  reset_password_token_expires: Date,

  // login
  email: String,
  password: String,


  images: {
    profile: ''
  },

  // cultivator, distributor, transport, manufacturer, retailer, microbusiness, laboratory, admin, sales
  role: { type: ObjectId, ref: 'UserType' },

  // if role is microbusiness, store array of sub licenses
  microbusinessRoles: [{ type: ObjectId, ref: 'UserType' }],

  // administrator details
  administrator: {
    administrator_name: String,
    administrator_first_name: String,
    administrator_last_name: String,
    administrator_phone: Number
  },

  // business details
  business: {
    business_name: String,
    business_phone: Number,
    address_line_1: String,
    address_line_2: String,
    city: String,
    state: String,
    zip: Number,
    business_description: String
  },

  credentials: {
    license: String,
    ein: String,
    metrc: String
  },

  // addresses
  addresses: [
    {
      nickname: String,
      address_line_1: String,
      address_line_2: String,
      city: String,
      state: String,
      zip: Number,
      default: Boolean
    }
  ],

  // payment methods
  payment_methods: [
    {
      // TODO: not accepting cards yet
      payment_type: String, // credit card
      card_type: String, // visa, mastercard, amex, discover

      cardholder_name: String,
      card_number: Number, // need to encrypt this
      last_four: Number, // for use when displaying ************1234
      card_expiration_year: Number,
      card_expiration_month: Number,

      // address: { type: ObjectId, ref: 'UserType' },
      address_line_1: String,
      address_line_2: String,
      city: String,
      state: String,
      zip: Number,

      default: Boolean
    }
  ],

  // user settings
  settings: {
    products: {
      filters: String, // stringified array of objects
      showLabDataOnly: Boolean,
      showLicensedOnly: Boolean,
      sortProperty: String,
      searchQuery: String
    },
    orders: {
      show: String // all, delivered, not_delivered
    },
    user: {
      licensePromptDismissed: Boolean,
      licensePromptPendingReminderDate: Date
    }
  },

  // sales user
  sales: {
    // starting with 1, a way to identify oneself when doing sign ups etc
    number: Number,
    sign_ups: [
      { type: ObjectId, ref: 'User' }
    ],
    clients: [
      { type: ObjectId, ref: 'User' }
    ]
  },

  // this is for a "soft user delete" | not sure what the impact of a hard delete would be
  deleted: Boolean

},
{
  usePushEach: true
});

var User = mongoose.model('User', userSchema);

module.exports = User;
