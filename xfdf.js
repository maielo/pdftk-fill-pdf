const Promise = require("bluebird");
const path = require("path");
const _ = require("lodash");
const builder = require("xmlbuilder");
const fs = require("fs");

function generate ({ data, pdfToFill }) {

    return new Promise(function (resolve, reject)  {

        const temp = `${path.dirname(__filename)}${path.sep}temp${path.sep}`;
        const tempXfdfName = `${_.random(999)}output.xfdf`;

        // Declare Root
        var rootEle = builder.create('xfdf', { version: '1.0', encoding: 'UTF-8'});

        // Add XFDF require attributes
        rootEle.att({ xmlns: 'http://ns.adobe.com/xfdf/'});
        rootEle.att({'xml:space': 'preserve' });

        // Create f element, if a pdf was supplied
        if ( pdfToFill ) {
            rootEle.ele('f', { href: pdfToFill });
        }

        // Create <fields> element
        var fieldsEle = rootEle.ele('fields');

        // Iterate through fields and write each one out
        _.forEach(data, function(value, name) {

            // Create field element with attribute of name
            var currentFieldEle = fieldsEle.ele('field', { name: name });

            if ( _.isBoolean(value) ) {

                // XFDF Translates a true to 'Yes' and a false to 'Off' for checkboxes and radios
                value = value ? 'Yes' : 'Off';
            }

            // Create value element inside of field element
            currentFieldEle.ele('value', {}, value);
        });

        const xfdfString = rootEle.end({ pretty: true, indent: '  ', newline: '\n' });
        const xfdfPath = `${temp}${tempXfdfName}`;
        // Write file out
        fs.writeFile(xfdfPath, xfdfString, (err) => {

            if (err) {
                reject(err);
            }

            return resolve(xfdfPath);
        });
    });
};

module.exports = { generate };