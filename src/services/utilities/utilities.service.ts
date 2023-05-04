import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import * as url from 'url';
import puppeteer from 'puppeteer';
import { buildPaths as bP } from '../../commons/buildPaths';
import { createTranscriptTemplate } from './template';
import * as AdmZip from 'adm-zip';


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
        const htmlDir = path.join(__dirname, "..", "..", "html");
        for (const file of fs.readdirSync(htmlDir)) {
            if (file !== "readme.txt") {
                fs.unlink(path.join(htmlDir, file), (err) => {
                    if (err) {
                        console.log(err);
                    }
                });
            }
        }

        const pdfDir = path.join(__dirname, "..", "..", "pdfs");
        for (const file of fs.readdirSync(pdfDir)) {
            if (file !== 'readme.txt') {
                fs.unlink(path.join(pdfDir, file), (err) => {
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
            const zipDir = path.join(__dirname, "..", "..", "zip");
            const pdfDir = path.join(__dirname, "..", "..", "pdfs");
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

        console.log("Starting: Generating PDF Process, Kindly wait ..");
        /** Launch a headleass browser */
        const browser = await puppeteer.launch({
            // executablePath: executablePath,
            args: ["--no-sandbox", '--disable-setuid-sandbox'],
        });
        /* 1- Ccreate a newPage() object. It is created in default browser context. */
        const page = await browser.newPage();
        /* 2- Will open our generated `.html` file in the new Page instance. */
        const pdfUrl = url.pathToFileURL(bP.buildPathHtml(reg)).href;
        await page.goto(pdfUrl, { waitUntil: "networkidle0" });
        // await page.goto(buildPathHtml(reg), { waitUntil: "networkidle0" });
        /* 3- Take a snapshot of the PDF */
        const pdf = await page.pdf({
            format: "A4",
            margin: {
                top: "20px",
                right: "20px",
                bottom: "20px",
                left: "20px",
            },
            printBackground: true,
        });
        /* 4- Cleanup: close browser. */
        await browser.close();
        console.log("Ending: Generating PDF Process");
        return pdf;
    };

    async generatePDF(transcriptJSON) {
        try {

            const reg = transcriptJSON["reg"];

            const html = await this.generateHTML(transcriptJSON);

            /* write the generated html to file */
            fs.writeFileSync(bP.buildPathHtml(reg), html);
            console.log("Succesfully created an HTML table");

            const pdf = await this.printPdf(reg);
            fs.writeFileSync(bP.buildPathPdf(reg), pdf);
            console.log("Succesfully created an PDF table");
            return pdf;
        } catch (error) {
            console.log("Error generating", error);
        }
    }

    async generateHTML(transcriptJSON) {
        try {

            const reg = transcriptJSON["reg"];

            /* Check if the file for `html` build exists in system or not */
            if (this.doesFileExist(bP.buildPathHtml(reg))) {
                console.log("Deleting old build file");
                /* If the file exists delete the file from system */
                fs.unlinkSync(bP.buildPathHtml(reg));
            }

            // const logo = path.join(__dirname, "..", "..", "assets", "logo.jpg");
            const logo = "data:image/jpeg;base64,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";
            const signature = path.join(__dirname, "..", "..", "assets", "dean.jpeg");

            const html = createTranscriptTemplate(transcriptJSON, logo, signature);

            return html;
        } catch (error) {
            console.log("Error generating", error);
        }
    }

}
