import { TranscriptService } from './../services/transcript/transcript.service';
import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Res,
  StreamableFile,
} from '@nestjs/common';
import type { Response } from 'express';
import { UtilitiesService } from 'src/services/utilities/utilities.service';
import * as fs from 'fs';

@Controller('/api/transcript')
export class TranscriptController {
  constructor(
    private transcript: TranscriptService,
    private utilities: UtilitiesService,
  ) {}

  @Get(':id')
  async getTranscriptById(
    @Param('id') id: String,
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      const transcript = await this.transcript.getTranscriptByRegNo(Number(id));
      const html = await this.utilities.generateHTML(transcript);

      res.set({
        'Content-Type': 'text/html',
      });

      return html;
    } catch (error: any) {
      return new NotFoundException('Transcript Not Found');
    }
  }

  @Get('json/:id')
  async getTranscriptJSONById(@Param('id') id: String) {
    try {
      const transcript = await this.transcript.getTranscriptByRegNo(Number(id));
      return transcript;
    } catch (error: any) {
      return new NotFoundException('Transcript Not Found');
    }
  }

  @Get('pdf/:id')
  async getTranscriptPDFById(
    @Param('id') id: String,
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      const transcript = await this.transcript.getTranscriptByRegNo(Number(id));
      const pdf = await this.utilities.generatePDF(transcript);

      res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename=${id}.pdf`,
      });
      return new StreamableFile(pdf);
    } catch (error: any) {
      return new NotFoundException('Transcript Not Found');
    }
  }

  @Get('pdf/batch/:batch')
  async getTranscriptPDFsByBatch(
    @Param('batch') batch: String,
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      const zipFilePath = await this.transcript.getTranscriptsByBatch(
        Number(batch),
      );
      const readStream = await fs.createReadStream(zipFilePath);
      res.set({
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename=${batch}.zip`,
      });
      return new StreamableFile(readStream);
    } catch (error: any) {
      return new NotFoundException('Transcript Not Found');
    }
  }
}
