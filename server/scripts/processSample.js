const apiLabDataModel = require('../jobs/xlims/api_lab_data_model');

const matrixMap = {
  'Flower': '',
  'Edible': '',
  'Topicals': '',
  'Others': '',
  'Concentrate': ''
}

const sampleTypeMap = {
  'Alcohol': '',
  'Baked Goods': '',
  'Beverages': '',
  'Butter': '',
  'Candies': '',
  'Clones': '',
  'CO2': '',
  'Composite': '',
  'Cooking Oil': '',
  'Cosmetics': '',
  'Cured Flower': '',
  'Feminine Products': '',
  'Field Duplicate': '',
  'Hash': '',
  'Hydrocarbon': '',
  'Jewelry': '',
  'Live Flower': '',
  'Meat': '',
  'Pipes': '',
  'Pollen': '',
  'Rosin': '',
  'Salves & Lotion': '',
  'Shake': '',
  'Soil': '',
  'Tinctures': '',
  'Trim': '',
  'Water': ''
}

function sanitizeLabResultName(key) {
  let sanitizedKey = key.replace('(-)-', '');
  sanitizedKey = sanitizedKey.replace(' %', '');
  sanitizedKey = sanitizedKey.replace(/[ \t]+$/, '');
  sanitizedKey = sanitizedKey.replace(/^[\d]/, '');
  sanitizedKey = sanitizedKey.replace(/^-/, '');
  sanitizedKey = sanitizedKey.replace(/-/g, '_');
  sanitizedKey = sanitizedKey.replace(/ /g, '_');
  sanitizedKey = sanitizedKey.replace(/\./g, '');
  sanitizedKey = sanitizedKey.toLowerCase();
  return sanitizedKey;
}

function formatLabResultName(name) {
  let sanitizedName = name.replace('(-)-', '');
  sanitizedName = sanitizedName.replace(' %', '');
  sanitizedName = sanitizedName.replace(/[ \t]+$/, '');
  sanitizedName = sanitizedName.replace(/^[\d]/, '');
  sanitizedName = sanitizedName.replace(/^-/, '');
  sanitizedName = sanitizedName.replace(/\./g, '');
  sanitizedName = sanitizedName.toLowerCase();
  return sanitizedName;
}

function normalizeSample(sample) {
  const { Results } = sample;
  sample.certificateData = {};
  for (let i = 0; i < Results.length; i++) {
    const thisResult = Results[i];
    // add formatted result name
    thisResult.FormattedResultName = formatLabResultName(thisResult.ResultName);
    // fix null values
    const keys = Object.keys(thisResult);
    for(let k = 0; k < keys.length; k++) {
      const thisKey = keys[k];
      thisResult[thisKey] = thisResult[thisKey] || 0;
    }
    // add simplified dataset used to build certificate
    sample.certificateData[sanitizeLabResultName(thisResult.ResultName)] = thisResult.ResultValue;
  }
  return sample
}

module.exports = function (sample) {
  const processedSample = normalizeSample(sample);
  return new Promise((resolve, reject) => {
    if (processedSample) {
      resolve(processedSample);
    } else {
      reject(console.error);
    }
  })
}

 