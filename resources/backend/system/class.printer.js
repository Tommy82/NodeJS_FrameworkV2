import { default as puppeteer } from 'puppeteer';
import ptp from 'pdf-to-printer';
import { v4 as uuidv4 } from 'uuid';
import { default as fs } from 'fs';

export default class Printer {
    static format = {
        NotSet: '',
        A4: 'A4',
        A5: 'A5',
        A6: 'A6'
    }

    constructor() {
        if (!fs.existsSync('./export')) { fs.mkdirSync('./export'); }
        if (!fs.existsSync('./export/printer')) { fs.mkdirSync('./export/printer'); }
        if (!fs.existsSync('./export/pdf')) { fs.mkdirSync('./export/pdf'); }
    }

    print = {
        toPdf: toPdf,
        toPrinter: toPrinter
    }
}

/** Generate a PDF File from Html Website
 * @param {string} url Website
 * @param {string} path Path, where the PDF should be saved
 * @param {string} format
 * @return {Promise<*>}
 */
export async function toPdf(url, path, format) {
    return new Promise(async (resolve, reject) => {
        try {
            const browser = await puppeteer.launch();
            const page = await browser.newPage();
            await page.goto(url, { waitUntil: 'networkidle2' });
            await page.pdf({ path: path, format: format});
            return resolve({path: path, format: format, success: true});
        } catch ( err ) { reject(err); }
    })
}

/** Generate a html File and Print it on Printer
 * @param {string} url Website
 * @param {Printer.format} format
 * @param {string} printer Name of Printer
 * @return {Promise<*>}
 */
export async function toPrinter(url, format, printer) {
    return new Promise( async (resolve, reject) => {
        try {
            const v4options = { random: [ 0x10,0x91,0x56,0xbe,0xc4,0xfb,0xc1,0xea,0x71,0xb4,0xef,0xe1,0x67,0x1c,0x58,0x36,], };

            let path = uuidv4(v4options);
            path = './data/output/printer/' + path;
            if ( !printer ) { printer = 'Microsoft Print to PDF'; }

            toPdf(url, path, format.toString())
                .then(() => {
                    ptp.print(path, { printer: printer})
                        .then(() => { return resolve(true); })
                        .catch((err) => { return reject(err); })
                })
                .catch(err => { return reject(err); })
        } catch ( err ) { return reject(err); }
    })
}