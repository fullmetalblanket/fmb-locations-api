const apiLabDataModel = require('./api_lab_data_model');

console.log('\napi model lab data',JSON.stringify(apiLabDataModel));

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

function sanitized(key) {
  // console.log('\nsanitized key raw', key);
  // let sanitizedKey = key;
  let sanitizedKey = key.replace('(-)-', '');
  sanitizedKey = sanitizedKey.replace(' %', '');
  sanitizedKey = sanitizedKey.replace(/[ \t]+$/, '');
  sanitizedKey = sanitizedKey.replace(/^[\d]/, '');
  sanitizedKey = sanitizedKey.replace(/^-/, '');
  sanitizedKey = sanitizedKey.replace(/-/g, '_');
  sanitizedKey = sanitizedKey.replace(/ /g, '_');
  sanitizedKey = sanitizedKey.replace(/\./g, '');
  sanitizedKey = sanitizedKey.toLowerCase();
  // console.log('sanitized', sanitizedKey);
  return sanitizedKey;
}

function normalizeSample(sample) {
  // console.log('\nnormalizeSample',sample)
  const { ReceivedDate, Results } = sample
  const normSample = {
    date_aquired: ReceivedDate,
    date_tested: Results[0].AnalysisDate,
    data: {}
  }
  for (let i = 0; i < Results.length; i++) {
    const thisResult = Results[i]
    const { ResultName, ResultValue } = thisResult
    const key = sanitized(ResultName)
    normSample.data[key] = ResultValue || 'String'
  }
  return normSample
}

module.exports = function (rawData) {
  const data = rawData.XLIMSExport.SampleInfo
  // console.log('\ndata',JSON.stringify(data[0]))
  // console.log('\ntotal samples',data.length)

  const processedData = []
  for (let i = 0; i < 1; i++) {
    const thisSample = data[i]
    const labData = normalizeSample(thisSample)
    processedData.push(labData)
  }

  // console.log('\nprocessedData',JSON.stringify(processedData[0]))

}

 