var request = require('request');
var config = require('../../config/config').weedmapsApi;

const api_key = config.apiKey
const weedmapsUrl = config.apiUrl

/**
 * example of query params
 * name=Green Crack&
 * listing_id=45304&
 * listing_type=dispensary&
 * thc=2&
 * thca=2&
 * cbd=2&
 * cbda=2&
 * cbn=2&
 * api_key=211761d5b6dcbd3bfaefcec48b42a3ec
 * 
 * required
 * @param apiPath string - api endpoint
 * @param listing_id string - client's weedmaps listing id
 * @param listing_type string - ex: dispensary
 * 
 * @param menu_item_id string - update lab test results for an existing menu item
 * To update the lab test results of an existing product (menu item), 
 * the "name" parameter must be an exact match with the menu item listed on Weedmaps.
 * @param name string - use in combination with category to update if no menu_item_id
 * @param category string -use in combination with name to update if no menu_item_id
 * 
 * potency required
 * @param thc_test_result string - ex: 16.91 or null
 * @param thca_test_result
 * @param cbd_test_result
 * @param cbda_test_result
 * @param cbn_test_result
 * 
 * optional
 * @param batch_number
 * @param picture_url
 * @param lab_tested string - date tested
 * 
 * To update lab test results for an existing menu item on your
 * client's WeedMenu, useeitherthe "menu_item_id" parameter, or a 
 * combination of the "name" plus "category" parameters to ensure 
 * the system is able to find and update the correct item.
 */

function requestOptions(body) {
  // var authorization = new Buffer(apiKey + ':' + params.listingId).toString('base64');
  
  var options = {
    url: weedmapsUrl,
    headers: {
      'Content-Type': 'application/json'
      // 'Authorization': 'Basic ' + authorization
    }
  };

  var queryParams = body;
  queryParams.api_key = api_key;

  console.log('\nrequestOptions: queryParams', queryParams);

  if (queryParams) {
    options.qs = queryParams;
    options.useQuerystring = true;
  }

  // if (body) {
  //   options.body = body;
  //   options.json = true;
  // }

  console.log('\nrequestOptions: options ', options);

  return options;
}


module.exports = function(app) {

  // add or update single or multiple
  app.post('/weedmaps', function(req, res) {
    // console.log('\nweedmaps: req.body', req.body);

    request.post(requestOptions(req.body), function(error, response, body) {
      if (error) console.log('\nweedmaps: error', error);
      // console.log('\nweedmaps.api: body', body);
      // console.log('\nmweedmaps.api: response ', response);
      // res.json(body);
      if (body) {
        res.json(body);
      }
      else {
        if (response.statusCode >= 200) {
          res.send({Message:'Success'});
        } else {
          res.send({Message:response.statusCode})
        }
      }
    });
  });


};
