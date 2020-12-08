const fs = require("fs");
const { exec } = require('child_process');
const Promise = require("bluebird");
const path = require('path');
const xfdf = require("./xfdf.js");
const _ = require("lodash");

const OPTIONS = {
    encoding: 'utf8',
    timeout: 100000,
    maxBuffer: 200*1024,
    killSignal: 'SIGTERM',
    cwd: null,
    env: null
};

exports.fill = function ({ pdfPath, data }) {

    if ( !pdfPath || !_.isString(pdfPath) ) {
        throw new Error("pdfPath ~ is not defined")
    }

    pdfPath = path.resolve(pdfPath);

    return new Promise ((resolve, reject) => {

        return xfdf
            .generate({ data, pdfToFill: pdfPath })
            .then((xfdfFile) => {

                const temp = `${path.dirname(__filename)}${path.sep}temp${path.sep}`;
                const tempPdfName = `${_.random(999)}output.pdf`;

                const cmd = `pdftk ${pdfPath} fill_form ${xfdfFile} output ${temp}${tempPdfName} need_appearances`;
                exec(cmd,OPTIONS,function (error, stdout, stderr) {
                    console.log(stdout)
                    if ( error ) {
                        return reject(error)
                    }

                    const fileBuffer = fs.readFileSync(`${temp}${tempPdfName}`);

                    // remove files (clean up)
                    fs.unlinkSync(`${temp}${tempPdfName}`);
                    fs.unlinkSync(xfdfFile);

                    return resolve(fileBuffer);
                });

            }).catch((err) => {
                return reject(err);
            });
    });
};
