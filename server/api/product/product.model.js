var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
var ObjectId  = Schema.Types.ObjectId;

var productSchema = mongoose.Schema({

  // a new product-listing can only be created by a cultivator (origin).
  // All other user types essentially just re-list a purchased product, changing Basic Information.
  // All re-listed products are linked back to origin via the tracking object.

  // A Product gets cloned at purchase (with updated tracking data), but can't be re-listed until it
  // has been delivered to the purchaser (order.delivered_date exists and is not null).

  // Ex: Manufacturer buys 1 kilogram of flowers from Distributor.
  // Manufacturer re-lists it as a new product-listing, changing the price
  // and unit_size to reflect the newly refined product-listing's properties.
  // If Manufacturer chooses gram as the unit_size that’s 1000 units_total.
  // App handles changing the units_total and units_available as needed.
  // Manufacturer may change:
  //     product_type (purchased flowers, selling wax)
  //     product_class (if created by combining two products) < - - - IMPORTANT
  // Manufacturer will sell the new product-listing BACK to the distributor. This third product-listing will be a clone of a clone
  // with different tracking data and possibly different Basic Information. Welcome to inception.

  // If a buyer returns purchased product in the full amount, that product can be deleted from that user's "bucket" in the database for cleanliness.

  //
  // Basic information
  // editable by product-listing creator (or re-lister)
  name: String,
  description: String,
  images: [
    {
      _id : false,
      primary: Boolean,
      url: String
    }
  ],

  product_class: { type: ObjectId, ref: 'ProductClass' }, // indica, sativa, hybrid, cbd, indica/sativa, sativa/indica

  product_grow_method: { type: ObjectId, ref: 'ProductGrowMethod' }, // indoor, outdoor, greenhouse, mixed light, light dep, other
  product_grow_method_other: String, // if product_grow_method is other

  cultivation_environment: { type: ObjectId, ref: 'CultivationEnvironment' }, // soil, hydroponic, aeroponic, other
  cultivation_environment_other: String, // if culitvation_environment is other

  certification_type: { type: ObjectId, ref: 'CertificationType' }, // Biodynamic, Clean Green, other
  certification_type_other: String, // if certification_type is other

  product_type: { type: ObjectId, ref: 'ProductType' }, // flowers, concentrates, edibles, prerolls, cartridges

  // if product_type is concentrate
  concentrate_type: { type: ObjectId, ref: 'ConcentrateType' }, // wax, crumble, shatter, rosin, RSO, other
  concentrate_type_other: String, // if concentrate_type is other
  extraction_method: { type: ObjectId, ref: 'ExtractionMethod' }, // BHO, CO2, Alcohol, Rosin Press, Ice Water, other
  extraction_method_other: String, // if extraction_method is other

  unit_size: { type: ObjectId, ref: 'ProductUnit'}, // mg, g, kg, oz, lbs

  // depends on unit size
  sub_units: [], // { eighth: boolean }, { quarter: boolean }, { half: boolean }

  price: Number, // price per unit_size

  // total at time of product-listing creation, or new total if product-listing replenished
  // when unit_available is increased, unit_total should increase by the same amount
  // this is used to know the total units that have been listed for this product
  units_total: Number, // represents the total amount of units added to the system for this product over time
  // example: when product first is added it may have 100 units_total and 100 units_available
  //          after 75 units are sold 100 more units are added to units_available making units_available = 125
  //          100 units also needs to be added to units_total making units_total = 200
  //          There are now 125 units_available out of 200 units_total
  units_available: Number, // decrements when units are sold

  date_available: Date, // date available to purchase
  active: Boolean, // product is listed: true or false


  // Laboratory
  lab: {
    unlisted: Boolean,
    location: { type: ObjectId, ref: 'User' }, // Novato or Santa Ana (sales@cblabs.us or sasales@cblabs.us)
    // sample_id: String, // mongo id's are too long for lab personnel to manually type, so we're generating our own
    // sample_name: String, // can be different than the product name
    date_acquired: Date, // date sample received by lab
    date_tested: Date, // date testing complete
    date_due: Date, // date test is due
    batch_number: String,
    batch_size: String,
    sample_increment: String,
    sample_weight: String,
    qr_code: String,
    certificate: String,
    state_certification: Boolean,
    // priority: Boolean,
    email_sent: {
      client: false,
      state: false
    },
    tests: [
      {
        _id : false,
        date_tested: Date,
        selected: Boolean,
        type: { type: ObjectId, ref: 'TestType' },
        name: String,
        machine: String,
        test_sample_weight: Number, // grams
        headers: {
          _id : false,
          mg: Boolean,
          ppm: Boolean,
          percent: Boolean,
          lod: Boolean,
          claim: Boolean
        },
        note: String,
        data: [{
          _id : false,
          name: String, 
          display_name: String,
          value: String,
          pass: Boolean,          
          mg: String,
          ppm: String,
          percent: String,
          limit: String,
          lod: String,
          claim: String
        }],
        // temporary
        claim1: {
          value: String,
          pass: Boolean
        },
        claim2: {
          value: String,
          pass: Boolean
        }
      }
    ],
    web_link: String,
    data: {
      thc: String,
      cbd: String,
      cbn: String,
      acetone: String,
      aerobic_count: String,
      alpha_bisabolol: String,
      alpha_humulene: String,
      alpha_pinene: String,
      alpha_terpinene: String,
      avermectins: String,
      beta_caryophyllene: String,
      beta_myrcene: String,
      beta_pinene: String,
      butanol: String,
      butanone: String,
      butyl_acetate: String,
      camphene: String,
      carbamates: String,
      cbc: String,
      cbc_output: String,
      cbd_output: String,
      cbda: String,
      cbda_output: String,
      cbg: String,
      cbg_output: String,
      cbga: String,
      cbga_output: String,
      cbn_output: String,
      cis_beta_ocimene: String,
      client: String,
      d_limonene: String,
      date: String,
      delta_3_carene: String,
      e_coli_count: String,
      enterobacteriae: String,
      ethanol: String,
      ether: String,
      ethyl_acetate: String,
      ethyl_formate: String,
      gamma_terpinene: String,
      geraniol: String,
      guaiol: String,
      heavy_metals: String,
      isobutyl_acetate: String,
      isopropyl_acetate: String,
      isopulegol: String,
      linalool: String,
      methyl_1_butanol: String,
      methyl_1_propanol: String,
      methyl_2_pentanone: String,
      methyl_acetate: String,
      n_butane: String,
      n_heptane: String,
      n_pentane: String,
      nerolidol_1: String,
      nerolidol_2: String,
      ocimene: String,
      organochlorinates: String,
      organophosphates: String,
      p_cymene: String,
      pentanol: String,
      propanol: String,
      pyrethroids: String,
      sampleid: String,
      samplename: String,
      sampletype: String,
      terpinolene: String,
      tert_butyl_methyl_ether: String,
      thc_output: String,
      thca: String,
      thca_output: String,
      thcv: String,
      thcv_output: String,
      total_coliforms: String,
      unitweight: String,
      yeast_and_mold: String
    }
  },
  // lab: {
  //   _id: { type: ObjectId, ref: 'User' },
  //   SampleNumber: String,
  //   SampleName: String,
  //   Client: String,
  //   Matrix: String,
  //   SampleType: String,
  //   SampleTemplateName: String,
  //   SampledDate: Date,
  //   SampledBy: String,
  //   ReceivedDate: Date,
  //   ReceivedBy: String,
  //   Results: [
  //     {
  //       ResultName: String,
  //       ResultValue: String,
  //       Units: String,
  //       AnalysisDate: Date
  //     }
  //   ]
  // },


  //
  // Metadata
  // used for queries and sorting
  metadata: {
    // populating tracking info on queries that return a large number of docs is very expensive
    // so we store a couple of things here that we need for queries and sorting
    // these things will need to be updated in bulk anytime a user changes their
    // business_name or user_type so we should discourage those actions
    seller_name: String, // user who created product 'Yerba Buena Farms', 'Willie's Crop', etc
    user_type: String, // user type who created product 'cultivator', 'retailer', etc
    licensed: Boolean
  },


  //
  // Tracking
  // gets updated by app when order is marked as delivered and product is cloned
  tracking: {
    created: Date, // can't be re-listed until Order.delivered_date is not null
    user: { type: ObjectId, ref: 'User'}, // Primary user for this product. They are the ones who either brought the sample to the lab or added a product to mm420
    secondary: { type: ObjectId, ref: 'User'}, // User id if tested by primary user on behalf of secondary
    display_user: { type: ObjectId, ref: 'User'}, // if there is a secondary user, the display_user is the user that the product would show up under in the app, should default to primary
    // track backwards by looking for tracking.source -> tracking.user
    // if no source(s), product-listing is "original product-listing" generated by a cultivator and user should be an id for a cultivator
    source: {
      product: { type: ObjectId, ref: 'Product' },
      order: { type: ObjectId, ref: 'Order' }
    }
  },

  // can be one, any combination, or all
  payment_types: [
    { type: ObjectId, ref: 'PaymentType' }
  ],

  // this is for a "soft delete", they can always be brought back from the dead
  deleted: Boolean

},
{
  usePushEach: true
});

var Product = mongoose.model('Product', productSchema);

module.exports = Product;
