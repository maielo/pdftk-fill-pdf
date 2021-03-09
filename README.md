# pdftk-fill-pdf

[PDFtk](https://www.pdflabs.com/tools/pdftk-the-pdf-toolkit/) is required

- fills special characters in native language (except Asian, Arabian) ✔️
- fills multiple form fields using same acrofield name ✔️
- handles checkboxes ✔️
- handles `undefined` and `null` values with empty string ✔️
- all asynchronous ✔️
- returns `Buffer` ✔️
- lightweight and no dependencies ✔️
- exposes `pdftk` and `xfdf` for customization ✔️
- written in typescript ✔️

#### Install

```
npm i pdftk-fill-pdf
```

## Examples

#### basic usage

```js
// commonJS
const pdfFill = require('pdftk-fill-pdf').default;
// ES6 modules
import pdfFill from 'pdftk-fill-pdf';

// key is fieldname in PDF
const fillData = {
  test1: 'abcdefghchijklmnopqrstuvwxyz123456',
  test2: 'another text',
  test_number: 123456789,
  test_special_chars:
    'ěščřžýáíéúůťńóú жжжююю ć, ń, ó, ś, ź Ä/ä, Ö/ö, Ü/ü  /{}"?>:{',
  test_checkbox: true,
  test_radio: true,
  test_null: null,
  test_undefined: undefined,
};

// your code
try {
  const pdfBuffer = await pdfFill.fill({
    pdfPath: 'test/test.pdf',
    data: fillData,
  });

  // do with buffer whatever you want i.e. write it into file
  fs.writeFileSync('./test/test_result.pdf', pdfBuffer, { encoding: 'utf8' });
} catch (err) {
  console.error(err);
}
```

#### Generate xfdf

```js
const fillData = {
  test1: 'abcdefghchijklmnopqrstuvwxyz123456',
  test2: 'another text',
  test_number: 123456789,
};

try {
  const xfdfString = await pdfFill.generateXfdf({
    pdfPath: 'test/test.pdf', // used for correct Xfdf href
    data: fillData, // same data as above
  });

  console.log(xfdfString);
} catch (err) {
  console.error(err);
}
```

#### Your own pdftk execution

docs: [pdftk the pdf toolkit](https://www.pdflabs.com/tools/pdftk-the-pdf-toolkit/)

```js
try {
  // ...
  // node.js exec options
  const OPTIONS = {
    timeout: 100000,
    maxBuffer: 200 * 1024,
  };
  const cmd = `fill_form ${xfdfFile} output ${generatedPdfFile} need_appearances`;
  const stdout = await pdfFill.generateXfdf(cmd, OPTIONS);
} catch (err) {
  console.log(err);
}
```
