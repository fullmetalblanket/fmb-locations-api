const PDFDocument = require('pdfkit');
const fs = require('fs');
const blobStream  = require('blob-stream');
const path = require('path');
const moment = require('moment');
const aws = require('./aws');
const request = require('request');
const mm420Api = require('../api/mm420-api');

function sortArray(array, property, direction) {
  direction = direction || 1;
  array.sort(function compare(a, b) {
      let comparison = 0;
      if (a[property] > b[property]) {
          comparison = 1 * direction;
      } else if (a[property] < b[property]) {
          comparison = -1 * direction;
      }
      return comparison;
  });
  return array; // Chainable
}

function sortTests(tests) {
  const solvents = tests.find(test => test.type.name === 'solvents');
  const solventsIndex = tests.findIndex(test => test.type.name === 'solvents');
  if (solvents) {
    tests.splice(solventsIndex, 1);
    tests.unshift(solvents);
  }

  const terpenes = tests.find(test => test.type.name === 'terpenes');
  const terpenesIndex = tests.findIndex(test => test.type.name === 'terpenes');
  if (terpenes) {
    tests.splice(terpenesIndex, 1);
    tests.unshift(terpenes);
  }

  const moisture = tests.find(test => test.type.name === 'moisture');
  const moistureIndex = tests.findIndex(test => test.type.name === 'moisture');
  if (moisture) {
    tests.splice(moistureIndex, 1);
    tests.unshift(moisture);
  }

  const potency = tests.find(test => test.type.name === 'potency');
  const potencyIndex = tests.findIndex(test => test.type.name === 'potency');
  if (potency) {
    tests.splice(potencyIndex, 1);
    tests.unshift(potency);
  }

  // const microbio = tests.find(test => test.type.name === 'microbio');
  // if (microbio) {
  //   const { data } = microbio;
  //   let f = data.filter(d => d.type === 'fungus')
  //   console.log('--> f',f)
  //   f = sortArray(f, 'name')
  //   let b = data.filter(d => d.type === 'bacteria')
  //   b = sortArray(b, 'name')
  //   microbio.data = b.concat(f)
  // }

  return tests;
}

function toTitleCase(str) {
  return str.replace(/\w\S*/g, function(txt){
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}

function percent(thing) {
  const num = thing.toString();
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



function create(sample) {

  return new Promise((resolve,reject) => {
    // console.log('certificate.create sample',sample)
    const logo = path.join(__dirname,'../../assets/images/cblabs-logo-blue.png');
    const signature = path.join(__dirname,'../../assets/images/clarence-signature.png');
    const { _id, name, product_type, lab, tracking } = sample;
    let { user: primaryUser, secondary: secondaryUser } = tracking
    const { qrcodeDataURL, tests, location: labUser, date_tested, date_acquired, batch_size, sample_increment, sample_weight } = lab;
    const selectedTests = sortTests(tests.filter(test => test.selected));
    const completeDate = moment(date_tested).format('M/D/YYYY');
    const receivedDate = moment(date_acquired).format('M/D/YYYY');

    const docWidth = 612;
    // const docHeight = 792;
    const docHeight = 828;
    // const docHeight = 864;
    const doc = new PDFDocument({
      size: [docWidth, docHeight],
      margins: {top: 36, bottom: 18, left: 36, right: 36},
      layout: 'portrait',
      bufferPages: true,
      info: {
        Title: 'Certificate of Analysis', 
        Author: 'CB Labs', // the name of the author
        Subject: 'Laboratory Testing', // the subject of the document
        // Keywords: 'pdf;javascript' // keywords associated with the document
        // CreationDate: 'DD/MM/YYYY', // the date the document was created (added automatically by PDFKit)
        // ModDate: 'DD/MM/YYYY' // the date the document was last modified
    }
    });

    // boundaries
    const b = {
      width: 540, // minus padding
      // height: 720,
      // documentHeight: 738,
      height: 756,
      documentHeight: 774,
      currentPage: 1,
      // columnWidth: 257,
      // col1: 36,
      // col1right: 293,
      // col2: 319,
      // right: 576,
      columnWidth: 260,
      col1: 30,
      col1right: 290,
      col2: 322,
      right: 582,
      col1savedRow: 1,
      col1savedPage: 1,
      col2savedRow: 1,
      col2savedPage: 1,
      currentColumn: 1,
      largeRowSize: 18,
      rowSize: 12,
      smallRowSize: 6,
      footerRowSize: 12,
      currentRow: 36, // current row value
      changePage: page => {
        b.currentPage = page;
        doc.switchToPage(page -1);
      },
      changeColumn: newCol => {
        if (newCol === 1) {
          b.col2savedPage = b.currentPage;
          b.col2savedRow = b.currentRow;
          b.currentRow = b.col1savedRow;
        } else {
          b.col1savedPage = b.currentPage;
          b.col1savedRow = b.currentRow;
          b.currentRow = b.col2savedRow;
        }
        b.currentColumn = newCol;
      },
      setCurrentRow: (row) => {
        b.currentRow = row;
        b.col1savedRow = row;
        b.col2savedRow = row;
      },
      newRow: (size) => {
        let pts = b.rowSize;
        let range = doc.bufferedPageRange();
        if (b.currentRow > b.documentHeight) {
          const nextPage = b.currentPage + 1;
          const col = `col${b.currentColumn}savedPage`
          b[col] === nextPage
          if (nextPage > range.count) {
            doc.addPage();
            b.currentPage = nextPage;
            b.currentRow = pts;
          } else {
            b.changePage(nextPage)
          }
        } else {
          if (size) {
            let rowSize = b.rowSize
            if (size === 'large') {
              rowSize = b.largeRowSize
            }
            if (size === 'small') {
              rowSize = b.smallRowSize
            }
            if (size === 'footer') {
              rowSize = b.footerRowSize
            }
            // const rowSize = size === 'large' ? b.largeRowSize : b.smallRowSize;
            pts = rowSize;
          }
        }
        b.currentRow = b.currentRow + pts;
        b[`col${b.currentColumn}savedRow`] = b.currentRow;
        return b.currentRow;
      },
    }

    console.log('\n');
    let currentPage = 0;
    let currentCol = 0;

    const testStartingRow = 222;

    const page = [{
      name: 0,
      col: [
        {row: testStartingRow},
        {row: testStartingRow}
      ]
    }];

    const addPage = () => {
      console.log('\naddPage');
      page.push({
        name: page.length,
        col: [
          {row: 36},
          {row: 36}
        ]
      })
      doc.addPage();
      console.log('page',JSON.stringify(page));
    }

    const newRow = (size) => {
      console.log('newRow');
      let rowSize = b.rowSize;
      if (size) {
        rowSize = size === 'large' ? b.largeRowSize : b.smallRowSize;
      }
      page[currentPage].col[currentCol].row = page[currentPage].col[currentCol].row + rowSize;
      return page[currentPage].col[currentCol].row;
    }

    const getTestHeight = test => {
      let height = b.rowSize * 2;
      height += b.rowSize - 2;
      for (let i = 0; i < test.data.length; i++) {
        const result = test.data[i];
        height += i === 0 ? b.smallRowSize : b.rowSize;
      }
      height += b.largeRowSize;
      if (test.type.name === 'potency') {
        height += b.rowSize * 4;
        height += b.largeRowSize;
      }
      return height;
    }

    // columnWidth: 260
    const colWidth = 30;
    const mgCol = 100;
    const percentCol = 145;
    const limitCol = 190;

    const renderTestHeader = (test, leftEdge, rightEdge) => {
      const { headers } = test;    

      console.log('renderTestHeader test',test)
      const amtCol = test.type.name === 'terpenes' ? percentCol : mgCol

      let lineRow = newRow();     
      doc.moveTo(leftEdge, lineRow)
        .lineTo(rightEdge, lineRow)
        .fillAndStroke('#000', '#aaa');

      const headersRow = newRow('small') - 3;
      doc.fontSize(7);
      if (headers) {
        if (headers.mg) {
          if (test.type.name === 'potency') {
            doc.text('mg/g', leftEdge + percentCol, headersRow, {width: colWidth, align: 'right'});
          } else {
            doc.text('mg/g', leftEdge + amtCol, headersRow, {width: colWidth, align: 'right'});
          }
        }
        if (headers.ppm) {
          if (test.type.name === 'pesticides') {
            doc.text('ppm', leftEdge + percentCol, headersRow, {width: colWidth, align: 'right'});
          } else {
            doc.text('ppm', leftEdge + amtCol, headersRow, {width: colWidth, align: 'right'});
          }
        }
        if (headers.percent) {
          if (test.type.name === 'terpenes' || test.type.name === 'potency') {
            doc.text('%', rightEdge - colWidth, headersRow, {width: colWidth, align: 'right'});
          } else {
            doc.text('%', leftEdge + percentCol, headersRow, {width: colWidth, align: 'right'});
          }
        }
      }
      if (test.type.name !== "terpenes" && test.type.name !== "potency") {
        if (test.type.name !== 'microbio') {
          doc.text('limit', leftEdge + limitCol, headersRow, {width: colWidth, align: 'right'});
        }
        doc.text('result', rightEdge - colWidth, headersRow, {width: colWidth, align: 'right'});
      }
      
      lineRow = newRow('small');
      doc.moveTo(leftEdge, lineRow)
        .lineTo(rightEdge, lineRow)
        .fillAndStroke('#000', '#aaa');
    }

    const renderTestFooter = (test, leftEdge, rightEdge) => {
      if (test.type.name === 'potency') {
        doc.fontSize(7);
        doc.text('LOQ (Limit of Quantitation) = 1.0', leftEdge, newRow('large'));
        doc.text('Total THC = THCA * 0.877 + THC', leftEdge, newRow());
        doc.text('Total CBD = CBDA * 0.877 + CBD', leftEdge, newRow());
        doc.text('d9THC = THC', leftEdge, newRow());
        doc.text('d8THC = 8THC', leftEdge, newRow());
      }
    }

    const trimTestData = test => {
      if (test.type.name === 'potency') {
        const omit = ['CBD Decarbed Total', 'THC Decarbed Total', 'Total Cannabinoids']
        test.data = test.data.filter(d => omit.indexOf(d.name) === -1)
      }
    }

    const renderTestData = (test, leftEdge, rightEdge) => {
      const { data } = test;
      const amtCol = test.type.name === 'terpenes' ? percentCol : mgCol
      for (let r = 0; r < data.length; r++) {
        let result = data[r];
        console.log('name',result.name);

        let resultRow = r === 0 ? newRow('small') : newRow();

        doc.fontSize(8);
        doc.text(result.name, leftEdge, resultRow);

        if (result.mg) {
          if (test.type.name === 'potency') {
            doc.text(result.mg, leftEdge + percentCol, resultRow, {width: colWidth, align: 'right'});
          } else {
            doc.text(result.mg, leftEdge + amtCol, resultRow, {width: colWidth, align: 'right'});
          }
        }
        if (result.ppm) {
          if (test.type.name === 'pesticides') {
            doc.text(result.ppm, leftEdge + percentCol, resultRow, {width: colWidth, align: 'right'});
          } else {
            doc.text(result.ppm, leftEdge + amtCol, resultRow, {width: colWidth, align: 'right'});
          }
        }
        if (result.percent) {
          if (test.type.name === 'terpenes' || test.type.name === 'potency') { 
            doc.text(result.percent, rightEdge - colWidth, resultRow, {width: colWidth, align: 'right'});
          } else {
            doc.text(result.percent, leftEdge + percentCol, resultRow, {width: colWidth, align: 'right'});
          }
        }

        let pass = result.pass ? 'PASS' : 'FAIL';
        if (result.name === 'Final weight' || result.name === 'Initial weight') {
          pass = ''
        }

        // if (result.name === 'Total THC') {
        //   result.limit = result.limit + '%'
        // }
        // if (test.type.name === 'potency' && result.name !== 'Total THC') {
        //   pass = 'PASS'
        // }

        if (test.type.name !== "terpenes" && test.type.name !== "potency") {
          doc.text(result.limit, leftEdge + limitCol, resultRow, {width: colWidth, align: 'right'});
          doc.text(pass, rightEdge - colWidth, resultRow, {width: colWidth, align: 'right'});
        }
      }
    }

    const renderFooters = () => {
      for (let i = 0; i < page.length; i++) {
        doc.switchToPage(i);
        renderFooter(b.col1, b.right, b.documentHeight, i+1, page.length);
      }
    }

    const renderFooter = (left, right, startRow, pageNum, pageLength) => {
      b.currentRow = startRow;
      let lineRow = startRow
      doc.moveTo(left, lineRow)
      .lineTo(right, lineRow)
      .fillAndStroke('#000', '#aaa');

      const imageRow = b.newRow('small');
      const textRow = imageRow + 14;

      doc.text('LOQ = Limit of Quantitation', b.col1, textRow)

      doc.text(`${pageNum}/${pageLength}`, b.col1right - 30, textRow, {width: 94, align: 'center'})
      .image(qrcodeDataURL, right - 32, imageRow, {fit: [34, 34]});
    }

    const renderSignatureAndQRCode = () => {
      // b.currentRow = getNextAvailableRow();
      selectPageAndRow(120, true)
      // console.log('NEW ROW',b.currentRow)
      const leftEdge = currentCol === 0 ? b.col1 : b.col2;
      const rightEdge = currentCol === 0 ? b.col1right : b.right;
      newRow('large');
      newRow('large');
      newRow('large');
      newRow('large');
      newRow('large');
      lineRow = newRow();
      console.log('lineRow',lineRow)
      doc.moveTo(leftEdge, lineRow)
        .lineTo(rightEdge, lineRow)
        .dash(5, {space: 10})
        .strokeColor('#aaa')
        .stroke()
        .undash();
      const signatureLine = newRow();
      doc.image(signature, leftEdge, signatureLine - 70, {width: 160});
      doc.text('Scientific Director, Clarence Gillett Ph. D.', leftEdge, signatureLine);
      
      // qr code
      b.currentRow = signatureLine - 92;
      const codeLine = b.currentRow;
      doc.image(qrcodeDataURL, rightEdge - 82, codeLine, {fit: [90, 90]});
      doc.text('verify at cblabs.us', rightEdge - 76, codeLine + 91, {width: 76, align: 'center'});
    }

    const selectPageAndRow = (thing, lastPage) => {
      let thingHeight = null;
      if (thing.data) {
        thingHeight = getTestHeight(thing);
      } else {
        thingHeight = thing;
      }
      const footerHeight = 40;
      const start = lastPage ? page.length - 1 : 0
      console.log('\nstart',start);
      for (let p = start; p < page.length; p++) {
        const thisPage = page[p];
        let mostSpace = 0;
        let colToUse = 0;
        for (let c = 0; c < thisPage.col.length; c++) {
          const thisCol = thisPage.col[c];
          const thisColEnd = thisCol.row;
          const remainingSpace = b.documentHeight - thisColEnd;
          if (remainingSpace > mostSpace) {
            mostSpace = remainingSpace;
            colToUse = c;
          }
        }
        if (mostSpace >= thingHeight + footerHeight) {
          if (p !== currentPage) {
            doc.switchToPage(p);
          }
          currentPage = p;
          currentCol = colToUse;
          return
        } 
      }
      console.log('!spaceFound');
      addPage();
      selectPageAndRow(thing);
    }

    const getNextAvailableRow = () => {
      console.log('\ngetNextAvailableRow page ',JSON.stringify(page))
      let row = 0;
      for (let c = 0; c < page[page.length - 1].col.length; c++) {
        const thisRow = page[page.length - 1].col[c].row;
        console.log('thisRow',thisRow);
        row = thisRow > row ? thisRow : row;
      }
      console.log('row',row)
      if (row > b.documentHeight - 120) {
        console.log('\ngetNextAvailableRow: not enough space ')
        addPage();
        return getNextAvailableRow();
      }
      return row;
    }


    // Start the doc

    doc.lineWidth(.25);

    // logo
    doc.image(logo, b.col1, b.currentRow, {fit: [60, 60]});

    // cb labs biz info
    const labBiz = labUser.business;
    b.currentRow = 26;
    const logoRight = 100;
    const logoTextWidth = b.columnWidth - logoRight;
    doc.fontSize(10)
      .text('CB Labs, Inc', logoRight, b.newRow(), {width: logoTextWidth})
      .text(`Lic. # ${labUser.credentials.license}`, logoRight, b.newRow(), {width: logoTextWidth})
      .text(`${labBiz.address_line_1} ${labBiz.address_line_2}`, logoRight, b.newRow(), {width: logoTextWidth})
      .text(`${labBiz.city}, ${labUser.business.state } ${labBiz.zip}`, logoRight, b.newRow(), {width: logoTextWidth})
      .text(labBiz.business_phone, logoRight, b.newRow(), {width: logoTextWidth});
    
    // client biz info
    // Distributor
    const infoWidth = 160;
    const primaryLeft = b.col1right - 40;
    const secondaryLeft = b.right - infoWidth;

    secondaryUser = secondaryUser || primaryUser;

    // Producer
    const primeBiz = primaryUser.business;
    const primeUserName = primeBiz && primeBiz.business_name || primaryUser.email;
    let secBiz = secondaryUser.business;
    let secUserName = secBiz && secBiz.business_name || secondaryUser.email;

    b.currentRow = 26;
    doc.fontSize(10);
    let r = b.newRow()
    doc.text('Distributor:', primaryLeft, r, {width: infoWidth, align: 'right'});
    doc.text('Producer:', secondaryLeft, r, {width: infoWidth, align: 'right'});
    r = b.newRow()
    doc.text(primeUserName, primaryLeft, r, {width: infoWidth, align: 'right'});
    doc.text(secUserName, secondaryLeft, r, {width: infoWidth, align: 'right'});
    r = b.newRow()
    doc.text(`Lic. # ${primaryUser.credentials.license || 'pending'}`, primaryLeft, r, {width: infoWidth, align: 'right'});
    doc.text(`Lic. # ${secondaryUser.credentials.license || 'pending'}`, secondaryLeft, r, {width: infoWidth, align: 'right'});
    r = b.newRow()
    doc.text(`${primeBiz.address_line_1} ${primeBiz.address_line_2}`, primaryLeft, r, {width: infoWidth, align: 'right'});
    doc.text(`${secBiz.address_line_1} ${secBiz.address_line_2}`, secondaryLeft, r, {width: infoWidth, align: 'right'});
    r = b.newRow()
    doc.text(`${primeBiz.city}, ${primeBiz.state } ${primeBiz.zip}`, primaryLeft, r, {width: infoWidth, align: 'right'});
    doc.text(`${secBiz.city}, ${secBiz.state } ${secBiz.zip}`, secondaryLeft, r, {width: infoWidth, align: 'right'});


    let lineRow = 105;     
    // doc.moveTo(b.col1, lineRow)
    //   .lineTo(b.right, lineRow)
    //   .fillAndStroke('#000', '#aaa');

    // title
    doc.fontSize(20)
      .text('Certificate of Analysis', 0, 110, {width: 610, align: 'center'});

    lineRow = 134;     
    doc.moveTo(b.col1, lineRow)
      .lineTo(b.right, lineRow)
      .fillAndStroke('#000', '#aaa');

    doc.fontSize(13)
      .text(`Name: ${name}`, b.col1, 142)
      .fontSize(10)
      .text(`ID: ${sample._id}`, b.col1, 161)
      .fontSize(9)
      .text(`Date Tested: ${completeDate}`, b.col1, 176)
      .text(`Date Received: ${receivedDate}`, b.col1, 190)
      .text(`Date Collected: ${receivedDate}`, b.col1, 204);

    doc.fontSize(13)
      .text(`Matrix: ${toTitleCase(product_type.name)}`, b.col2, 142, {width: b.columnWidth, align: 'right'})
      .fontSize(9)
      .text(`Batch Size: ${batch_size}`, b.col2, 162, {width: b.columnWidth, align: 'right'})
      .text(`Sample Increment: ${sample_increment}`, b.col2, 176, {width: b.columnWidth, align: 'right'})
      .text(`Sample Weight: ${sample_weight}`, b.col2, 190, {width: b.columnWidth, align: 'right'});

    // sample name and matrix
    // doc.fontSize(14)
    //   .text(`${name}, ${toTitleCase(product_type.name)}`, 0, 134, {width: 610, align: 'center'});


    //
    // tests
    //
    doc.fontSize(10);

    for (let i = 0; i < selectedTests.length; i++) {
      const test = selectedTests[i];
      console.log('\ntest',test.name);

      trimTestData(test)

      selectPageAndRow(test);

      const leftEdge = currentCol === 0 ? b.col1 : b.col2;
      const rightEdge = currentCol === 0 ? b.col1right : b.right;

      const titleRow = newRow();

      doc.fontSize(11)
        .text(toTitleCase(test.name), leftEdge, (titleRow - 2));

      if (test.type.name === 'potency') {
        doc.fontSize(7).text('(dry weight)', leftEdge + 74, titleRow)
      }

      if (test.machine) {
        doc.fontSize(8)
          .text(test.machine, leftEdge, (titleRow + 1), {width: b.columnWidth, align: 'right'});
      }

      renderTestHeader(test, leftEdge, rightEdge);

      renderTestData(test, leftEdge, rightEdge)

      renderTestFooter(test, leftEdge, rightEdge)

      newRow('large');
    }


    renderSignatureAndQRCode();

    renderFooters();

    console.log('certificate created ')
    doc.end();

    resolve(doc);
  })
  .catch(error => {
    console.log(error)
    reject(error)
  });

}

function upload(certificate, id) {
  const params = {
    ACL: 'public-read',
    Bucket: 'matchmaker420',
    Body: certificate,
    ContentType: 'application/pdf',
    Key: `certificates/certificate-${id}.pdf`
  }
  return aws.upload(params)
    .then((aws) => {
      return aws
    })
    .catch(error => error)
}


function email(email, name, number, certURL, params) {
  const from = params && params.from ? params.from : 'admin@matchmaker420.com'
  const payload = {
    from,
    to: email,
    subject: `Certificate for ${name} - ${number}`,
    attachments: [
      {
        filename: `certificate-${number}.pdf`,
        path: certURL,
        cid: `certificate-${number}`
      }
    ],
    params
  }
  console.log('certificate.email payload ',payload);
  return new Promise((resolve, reject) => {
    request.post(mm420Api.requestOptions({url:'/email-pdf'}, payload), function(error, response, data) {
      if (!error && response.statusCode == 200) {
        resolve(data)
      }
      reject(error)
    });
  });
}

module.exports = {
  create,
  upload,
  email
}
