import {
  BadRequestException,
  Body,
  Controller,
  InternalServerErrorException,
  NotFoundException,
  Post,
  UploadedFile,
  UseInterceptors
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { schemeofstudy } from '@prisma/client';
import { SchemeOfStudiesService } from 'src/services/scheme-of-studies/scheme-of-studies.service';

@Controller('/api/scheme-of-studies')
export class SchemeOfStudiesController {
  constructor(private readonly schemeOfStudiesService: SchemeOfStudiesService) {}

  @Post('verify')
  @UseInterceptors(FileInterceptor('file'))
  async verifySchemeOfStudies(@UploadedFile() file: Express.Multer.File) {
    try {
      // Validate the uploaded file
      if (!file) {
        return new NotFoundException('No File Uploaded');
      }
      if (file.mimetype !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
        return new BadRequestException('Invalid File Type');
      }
      const response = await this.schemeOfStudiesService.extractSchemeOfStudiesDataFromExcelFile(
        file
      );
      if (
        response instanceof BadRequestException ||
        response instanceof InternalServerErrorException
      ) {
        return {
          count: response?.['length'],
          data: response
        };
      }
      return response;
    } catch (error) {
      return new InternalServerErrorException('No Scheme of Studies Found');
    }
  }

  @Post('add-many')
  async addSchemeOfStudies(@Body() schemeOfStudies: schemeofstudy[]) {
    try {
      const response = await this.schemeOfStudiesService.addSchemeOfStudies(schemeOfStudies);
      return response;
    } catch (error: any) {
      return new InternalServerErrorException('Something went wrong');
    }
  }
}
