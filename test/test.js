const pdfFill = require("../index.js");
const fs = require("fs");

const data = {
  test1: "abcdefghchijklmnopqrstuvwxyz",
  test2: "another text",
  test_number: 123456789,
  test_cz: "ěščřžýáíéúůťńóú",
  test_checkbox: true,
  test_radio: true
};


pdfFill.fill({ pdfPath: "test/test.pdf", data }).then((data) => {

  fs.writeFileSync("./test/test_result.pdf", data, { encoding: 'utf8' });
  console.log("SUCCESS ~ result in ./test/test_result.pdf");
});