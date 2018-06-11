const PDFDocument = require('pdfkit');
const fs = require('fs');
const blobStream  = require('blob-stream');
const path = require('path');

function percent(thing) {
  // console.log('\npercent: thing', thing);
  const num = thing.toString();
  // console.log('percent: num', num);
  // console.log('percent: return', isNaN(thing) ? '-' : parseFloat(num).toFixed(2));
  return isNaN(thing) ? '-' : parseFloat(num).toFixed(2);
}

function total(args) {
  let total = 0;
  for (let i = 0; i < args.length; i++) {
    const thisArg = args[i]
    if (!isNaN(thisArg)) {
      total += +thisArg;
    }
  }
  return percent(total);
}

// function create(filename, data) {
function create(data) {
  const b = {
    col1: 40,
    col2: 315,
    right: 570,
    width: 610,
    columnWidth: 255
  }

  return new Promise((resolve,reject) => {
    const doc = new PDFDocument;

    const logo = path.join(__dirname,'../../assets/images/cblabs-logo-blue.png');
    // const qrCode = data.qrcodeURL;
    const qrCode = data.qrcodeDataURL;

    doc
      .lineWidth(.5);

    doc.image(logo, b.col1, 40, {fit: [90, 90]})
      .fontSize(14)
      .text('Tomorrow\'s Standard for Medical Testing', 140, 70, {width: 140});
    
    doc.fontSize(10)
      .text('Sample Name: '+data.samplename, 250, 42, {width: 320, align: 'right'})
      .text('Sample ID: '+data.sampleid, 250, 61, {width: 320, align: 'right'})
      .text('Sample Type: '+data.sampletype, 251, 80, {width: 320, align: 'right'})
      .text('Tested For: '+data.client, 250, 99, {width: 320, align: 'right'})
      .text('Date Tested: '+data.date, 250, 118, {width: 320, align: 'right'});

    doc.fontSize(32)
      .text('Certificate of Analysis', 0, 160, {width: 610, align: 'center'});

    // potency
    doc.fontSize(12)
      .text('Potency Test Results', b.col1, 220)

      .stroke('#777')
      .moveTo(b.col1, 235)
      .lineTo(295, 235)

      .fontSize(10)
      .fillColor('#777')
      .text('mg/g', b.col1 + 120, 238)
      .text('%', b.col1 + 220, 239)

      .moveTo(b.col1, 250)
      .lineTo(295, 250)
      .stroke()
      .fillColor('#000')

      // row
      .text('Total THC', b.col1, 260)
      .text(total([data.thc,data.thca,data.thcv]), b.col1 + 220, 260)

      // row
      .text('THC', b.col1, 272)
      .text('-', b.col1 + 120, 272)
      .text(percent(data.thc), b.col1 + 220, 272)

      .text('THCa', b.col1, 284)
      .text('-', b.col1 + 120, 284)
      .text(percent(data.thca), b.col1 + 220, 284)

      .text('THCv', b.col1, 296)
      .text('-', b.col1 + 120, 296)
      .text(percent(data.thcv), b.col1 + 220, 296)

      .text('Total CBD', b.col1, 308)
      .text('-', b.col1 + 120, 308)
      .text(total([data.cbd,data.cbda]), b.col1 + 220, 308)

      .text('CBD', b.col1, 320)
      .text('-', b.col1 + 120, 320)
      .text(percent(data.cbd), b.col1 + 220, 320)

      .text('CBDa', b.col1, 332)
      .text('-', b.col1 + 120, 332)
      .text(percent(data.cbda), b.col1 + 220, 332)

      .text('CBN', b.col1, 344)
      .text('-', b.col1 + 120, 344)
      .text(percent(data.cbn), b.col1 + 220, 344)

      .text('CBG', b.col1, 356)
      .text('-', b.col1 + 120, 356)
      .text(percent(data.cbg), b.col1 + 220, 356)

      .text('CBGa', b.col1, 368)
      .text('-', b.col1 + 120, 368)
      .text(percent(data.cbga), b.col1 + 220, 368)

      .text('CBC', b.col1, 380)
      .text('-', b.col1 + 120, 380)
      .text(percent(data.cbc), b.col1 + 220, 380);

    // terpine
    doc.fontSize(12)
      .fillColor('#000')
      .text('Terpine Test Results', b.col2, 220)
      .text('Terpine scent', b.col2 + 150, 220, {width: 105, align: 'right'})

      .stroke('#777')
      .moveTo(b.col2, 235)
      .lineTo(b.right, 235)

      .fontSize(10)
      .fillColor('#777')
      .text('mg/g', b.col2, 238, {width: b.columnWidth - 15, align: 'right'})

      .moveTo(b.col2, 250)
      .lineTo(b.right, 250)
      .stroke()

      .fontSize(10)
      .fillColor('#000')
      .text('Terpinolene', b.col1, 445)
    ;

    // pesticide
    doc.fontSize(12)
    .text('Pesticide Test Results', b.col1, 420)
    .text('Threshold Limits', b.col1 + 167, 420)

    .moveTo(b.col1, 435)
    .lineTo(295, 435)
    .stroke('#777')

    .fontSize(10)
    .fillColor('#000')
    .text('Carbamates', b.col1, 445)
    .text('Heavy Metals', b.col1, 457)
    .text('Organophosphates', b.col1, 469)
    .text('Avermectins', b.col1, 481)
    .text('Organochlorinates', b.col1, 493)
    .text('Pyrethroids', b.col1, 505)
  ;


    // solvents


    // microbiological


    // qr code and seal image
    doc
      .image(qrCode, 325, 610, {fit: [90, 90]})
      .fontSize(7)
      .text('Scan to verify at CBLabs.us', 326, 700);


    // legend
    // N/A - NOT TESTED, ND - NOT DETECTED, ppm - PARTS PER MILLION, cfu - COLONY FORMING UNITS


    // doc.rect(doc.x, 40, 320, doc.y).stroke()

    // Finalize PDF file
    doc.end();

    // console.log('\nAAA filename',filename)
    // console.log('AAA doc',doc)
    // console.log('resolve data',data.client)
    // resolve({doc, data})
    resolve(doc);
  });

}

module.exports.create = create;