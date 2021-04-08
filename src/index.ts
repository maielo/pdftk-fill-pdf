import fs from 'fs';
import path from 'path';
import { exec, ExecOptions } from 'child_process';
import { promises as fsp } from 'fs';

export type FillData = Record<string, string | number | boolean>;

function _getRandomName() {
  return `file_${Math.round(Math.random() * 10000)}`;
}

const pdfFill = {
  fill: async function({
    data,
    pdfPath,
    tempPath,
  }: {
    data: FillData;
    pdfPath: string;
    tempPath: string;
  }): Promise<Buffer> {
    if (!data || typeof data !== 'object') {
      throw new Error(
        'pdf-fill ~ fillData is not defined (should be object of data to fill)'
      );
    }

    if (!pdfPath || typeof pdfPath !== 'string') {
      throw new Error('pdf-fill ~ pdfPath is not defined');
    }
    const _pdfPath = path.resolve(pdfPath);

    if (typeof pdfPath === 'string' && !fs.existsSync(_pdfPath)) {
      throw new Error('pdf-fill ~ there is not file : ' + pdfPath);
    }
    const _xfdf = await this.generateXfdf({ data, pdfPath });

    const pathToTemp = tempPath || path.resolve('./temp');
    const bulkRandomName = _getRandomName();
    const xfdfFile = `${pathToTemp}${path.sep}${bulkRandomName}.xfdf`;
    const generatedPdfFile = `${pathToTemp}${path.sep}${bulkRandomName}.pdf`;

    // write xdfd for pdftk
    await fsp.writeFile(xfdfFile, _xfdf);
    // run pdftk (it returns shit...only on error)
    await this.execPdftk(
      `${_pdfPath} fill_form ${xfdfFile} output ${generatedPdfFile} need_appearances`
    );

    const file = await fsp.readFile(generatedPdfFile);
    // cleanup
    await fsp.unlink(xfdfFile);
    await fsp.unlink(generatedPdfFile);

    return file;
  },
  generateXfdf: async function({
    data,
    pdfPath,
  }: {
    data: FillData;
    pdfPath: string;
  }): Promise<string> {
    const _pdfPath = path.resolve(pdfPath);

    return `

    <?xml version="1.0" encoding="UTF-8"?>
      <xfdf xmlns="http://ns.adobe.com/xfdf/" xml:space="preserve">
        <f href="${_pdfPath}"/>
        <fields>
          ${Object.keys(data)
            .map(key => {
              let value = data[key];

              if (value === null || value === undefined) {
                value = '';
              }

              if (typeof value === 'boolean') {
                value = value ? 'Yes' : 'Off';
              }

              return `
            <field name="${key}">
              <value>${value}</value>
            </field>
            `;
            })
            .join('')}
        </fields>
      </xfdf>
    `;
  },
  execPdftk(cmd: string, customExecOptions?: ExecOptions): Promise<string> {
    const OPTIONS = {
      timeout: 100000,
      maxBuffer: 200 * 1024,
      ...customExecOptions,
    };
    console.log('cmd', cmd);
    return new Promise((resolve, reject) => {
      exec(`pdftk ${cmd}`, OPTIONS, function(error, stdout, stderr) {
        console.log(stdout);
        if (error) {
          console.error(error);
          return reject(error);
        }

        if (stderr) {
          console.error(stderr);
          return reject(stderr);
        }

        return resolve(stdout);
      });
    });
  },
};

export default pdfFill;
