# pdftk-fill-pdf
- Another pdftk fill, supports UTF-8 characters
- works on node > 12.X.X
- [PDFTK](https://www.pdflabs.com/tools/pdftk-the-pdf-toolkit/) is required to be installed

## Install

```
npm i pdftk-fill-pdf
```

## How to use

```js
const pdfFill = require("pdftk-fill-pdf");

const data = {
  test1: "abcdefghchijklmnopqrstuvwxyz",
  test2: "another text",
  test_number: 123456789,
  test_cz: "ěščřžýáíéúůťńóú",
  test_checkbox: true,
  test_radio: true
};

pdfFill.fill({ pdfPath: "test/test.pdf", data }).then((data) => {

  // do what you want with it, either write it or send it back to client
  fs.writeFileSync("./test/test_result.pdf", data, { encoding: 'utf8' });
  console.log("SUCCESS ~ result in ./test/test_result.pdf");
});
```


