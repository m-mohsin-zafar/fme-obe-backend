import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import * as ExcelJS from 'exceljs';
import { schemeofstudy } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SchemeOfStudiesService {
  constructor(private readonly prismaService: PrismaService) {}

  async extractSchemeOfStudiesDataFromExcelFile(file: Express.Multer.File) {
    const workbook = new ExcelJS.Workbook();
    try {
      await workbook.xlsx.load(file.buffer);
      const worksheet = workbook.worksheets[0];
      const rows = worksheet.getRows(2, worksheet.rowCount);

      let schemeOfStudies: schemeofstudy[] = [];
      for (let row of rows) {
        if (row.getCell(1).value === null) {
          break;
        }
        schemeOfStudies.push({
          CourseCode: row.getCell(3).value.toString() ?? '',
          CourseTitle: row.getCell(4).value.toString() ?? '',
          Semester: row.getCell(1).value.toString() ?? '',
          Batch: row.getCell(2).value ? Number(row.getCell(2).value) : null,
        });
      }

      schemeOfStudies = this.filterEmptyRows(schemeOfStudies);

      if (schemeOfStudies.length === 0) {
        return new BadRequestException(
          'No Scheme of Studies Found in the uploaded file',
        );
      }

      return schemeOfStudies;
    } catch (error) {
      return new InternalServerErrorException(
        'Something went wrong while extracting data from scheme of study excel file',
      );
    }
  }

  async addSchemeOfStudies(schemeOfStudies: schemeofstudy[]) {
    try {
      const schemeOfStudiesList =
        await this.prismaService.schemeofstudy.createMany({
          data: schemeOfStudies,
          skipDuplicates: true,
        });
      return schemeOfStudiesList;
    } catch (error: any) {
      return new InternalServerErrorException(`Something went wrong. ${error}`);
    }
  }

  private filterEmptyRows(data) {
    return data.filter((row) =>
      Object.values(row).every(
        (value) => value !== '' && value !== null && value !== undefined,
      ),
    );
  }
}
