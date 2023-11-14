import {
  BadRequestException,
  Body,
  Controller,
  InternalServerErrorException,
  NotFoundException,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { courseplo } from '@prisma/client';
import { PLODataDto } from 'src/dtos/ploData.dto';
import { PloService } from 'src/services/plo/plo.service';

@Controller('api/plo')
export class PloController {
  constructor(private readonly ploService: PloService) {}
  @Post('verify')
  @UseInterceptors(FileInterceptor('file'))
  async verifyPLOSheet(@UploadedFile() file: Express.Multer.File) {
    try {
      // Validate the uploaded file
      if (!file) {
        return new NotFoundException('No File Uploaded');
      }
      if (
        file.mimetype !==
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      ) {
        return new BadRequestException('Invalid File Type');
      }
      const response = await this.ploService.extractPLODataFromExcelFile(file);
      if (
        response instanceof BadRequestException ||
        response instanceof InternalServerErrorException
      ) {
        return {
          count: response?.['length'],
          data: response,
        };
      }
      return response;
    } catch (error) {
      return new InternalServerErrorException('No PLO Data Found');
    }
  }

  @Post('add-many')
  async addSchemeOfStudies(@Body() ploData: PLODataDto[]) {
    try {
      const response = await this.ploService.addPLOData(ploData);
      return response;
    } catch (error: any) {
      return new InternalServerErrorException('Something went wrong');
    }
  }
}
