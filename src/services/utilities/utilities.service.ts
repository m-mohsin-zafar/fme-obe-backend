import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import * as url from 'url';
import puppeteer from 'puppeteer';
import { buildPaths as bP } from '../../commons/buildPaths';
import { createTranscriptTemplate } from './template.rf';
import * as AdmZip from 'adm-zip';
import { LOGO, SIGNATURE } from '../../commons/base64assets';

@Injectable()
export class UtilitiesService {
  doesFileExist(filePath) {
    try {
      fs.statSync(filePath); // get information of the specified file path.
      return true;
    } catch (error) {
      return false;
    }
  }

  async clearAllFiles() {
    const htmlDir = path.join(__dirname, '..', '..', 'html');
    for (const file of fs.readdirSync(htmlDir)) {
      if (file !== 'readme.txt') {
        fs.unlink(path.join(htmlDir, file), err => {
          if (err) {
            console.log(err);
          }
        });
      }
    }

    const pdfDir = path.join(__dirname, '..', '..', 'pdfs');
    for (const file of fs.readdirSync(pdfDir)) {
      if (file !== 'readme.txt') {
        fs.unlink(path.join(pdfDir, file), err => {
          if (err) {
            console.log(err);
          }
        });
      }
    }
  }

  async createZipArchive(filename: string) {
    try {
      const zip = new AdmZip();
      const zipDir = path.join(__dirname, '..', '..', 'zip');
      const pdfDir = path.join(__dirname, '..', '..', 'pdfs');
      const outputFile = path.join(zipDir, `${filename}`);
      zip.addLocalFolder(pdfDir);
      zip.writeZip(outputFile);
      console.log(`Created ${outputFile} successfully`);
      return outputFile;
    } catch (e) {
      console.log(`Something went wrong. ${e}`);
    }
  }

  async printPdf(reg) {
    console.log('Starting: Generating PDF Process, Kindly wait ..');
    /** Launch a headleass browser */
    const browser = await puppeteer.launch({
      // executablePath: executablePath,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe'
    });
    /* 1- Ccreate a newPage() object. It is created in default browser context. */
    const page = await browser.newPage();
    /* 2- Will open our generated `.html` file in the new Page instance. */
    const pdfUrl = url.pathToFileURL(bP.buildPathHtml(reg)).href;
    await page.goto(pdfUrl, { waitUntil: 'networkidle0' });
    // await page.goto(buildPathHtml(reg), { waitUntil: "networkidle0" });
    /* 3- Take a snapshot of the PDF */
    const pdf = await page.pdf({
      format: 'A4',
      margin: {
        top: '20px',
        right: '20px',
        bottom: '20px',
        left: '20px'
      },
      printBackground: true
    });
    /* 4- Cleanup: close browser. */
    await browser.close();
    console.log('Ending: Generating PDF Process');
    return pdf;
  }

  async generatePDF(transcriptJSON) {
    try {
      const reg = transcriptJSON['reg'];

      const html = await this.generateHTML(transcriptJSON);

      /* write the generated html to file */
      fs.writeFileSync(bP.buildPathHtml(reg), html);
      console.log('Succesfully created an HTML table');

      const pdf = await this.printPdf(reg);
      fs.writeFileSync(bP.buildPathPdf(reg), pdf);
      console.log('Succesfully created an PDF table');
      return pdf;
    } catch (error) {
      console.log('Error generating', error);
    }
  }

  async generateHTML(transcriptJSON) {
    try {
      const reg = transcriptJSON['reg'];

      /* Check if the file for `html` build exists in system or not */
      if (this.doesFileExist(bP.buildPathHtml(reg))) {
        console.log('Deleting old build file');
        /* If the file exists delete the file from system */
        fs.unlinkSync(bP.buildPathHtml(reg));
      }

      // const logo = path.join(__dirname, "..", "..", "assets", "logo.jpg");
      const logo = LOGO;
      // const signature = path.join(__dirname, "..", "..", "assets", "dean.jpeg");
      const signature = SIGNATURE;

      const html = createTranscriptTemplate(transcriptJSON, logo, signature);

      return html;
    } catch (error) {
      console.log('Error generating', error);
    }
  }
}
