import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as ExcelJS from 'exceljs';
import { PLODataDto } from 'src/dtos/ploData.dto';

@Injectable()
export class PloService {
  constructor(private readonly prismaService: PrismaService) {}

  async extractPLODataFromExcelFile(file: Express.Multer.File) {
    try {
      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.load(file.buffer);
      const worksheet = workbook.worksheets[0];
      const dataRows = worksheet.getRows(10, worksheet.rowCount);

      const courseCode = worksheet.getRow(2).getCell(3).toString();
      const semester = worksheet.getRow(7).getCell(3).toString();

      let ploData: PLODataDto[] = [];
      for (let row of dataRows) {
        if (row.getCell(1).value === null) {
          break;
        }
        ploData.push({
          RegNo: Number(row.getCell(2).value),
          CourseCode: courseCode,
          Semester: semester,
          PLO1: this.replacePLOAttainmentWithYesNoEmpty(row.getCell(5).value),
          PLO2: this.replacePLOAttainmentWithYesNoEmpty(row.getCell(6).value),
          PLO3: this.replacePLOAttainmentWithYesNoEmpty(row.getCell(7).value),
          PLO4: this.replacePLOAttainmentWithYesNoEmpty(row.getCell(8).value),
          PLO5: this.replacePLOAttainmentWithYesNoEmpty(row.getCell(9).value),
          PLO6: this.replacePLOAttainmentWithYesNoEmpty(row.getCell(10).value),
          PLO7: this.replacePLOAttainmentWithYesNoEmpty(row.getCell(11).value),
          PLO8: this.replacePLOAttainmentWithYesNoEmpty(row.getCell(12).value),
          PLO9: this.replacePLOAttainmentWithYesNoEmpty(row.getCell(13).value),
          PLO10: this.replacePLOAttainmentWithYesNoEmpty(row.getCell(14).value),
          PLO11: this.replacePLOAttainmentWithYesNoEmpty(row.getCell(15).value),
          PLO12: this.replacePLOAttainmentWithYesNoEmpty(row.getCell(16).value),
        });
      }

      ploData = this.filterEmptyRows(ploData);

      if (ploData.length === 0) {
        return new BadRequestException(
          'No PLO Data Found in the uploaded file',
        );
      }

      return ploData;
      return 1;
    } catch (error) {
      return new InternalServerErrorException(
        `Something went wrong while extracting data from PLO excel file:: ${error}`,
      );
    }
  }
  async addPLOData(ploData: PLODataDto[]) {
    try {
      const ploDataInsertion = await this.prismaService.courseplo.createMany({
        data: ploData,
        skipDuplicates: true,
      });
      return ploDataInsertion;
    } catch (error) {
      return new InternalServerErrorException(`Something went wrong. ${error}`);
    }
  }

  private filterEmptyRows(data) {
    return data.filter((row) =>
      Object.values(row).every(
        (value) => value !== null && value !== undefined,
      ),
    );
  }

  private replacePLOAttainmentWithYesNoEmpty(value) {
    if (value === null) {
      return '';
    } else {
      if (Number(value) === 1) {
        return 'Y';
      } else if (Number(value) === 0) {
        return 'N';
      }
    }
  }
}
