import { PrismaService } from './../prisma/prisma.service';
import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { student } from '@prisma/client';
import * as ExcelJS from 'exceljs';

@Injectable()
export class StudentService {
  constructor(private prismaService: PrismaService) {}

  async getAllBatches() {
    let batches = await this.prismaService.student.findMany({
      select: {
        Batch: true
      },
      distinct: ['Batch']
    });
    return batches.map(student => student.Batch);
  }

  async getAllStudents() {
    return await this.prismaService.student.findMany();
  }

  async getStudentById(regNo: number) {
    return await this.prismaService.student.findUnique({
      where: {
        RegNo: regNo
      }
    });
  }

  async getStudentsByBatch(batch: number) {
    return await this.prismaService.student.findMany({
      where: {
        Batch: batch
      },
      orderBy: {
        RegNo: 'asc'
      }
    });
  }

  async getStudentsRegNosByBatch(batch: number) {
    let students = await this.prismaService.student.findMany({
      select: {
        RegNo: true
      },
      where: {
        Batch: batch
      }
    });
    return students.map(student => student.RegNo);
  }

  async extractStudentsDataFromExcelFile(
    file: Express.Multer.File
  ): Promise<student[] | BadRequestException | InternalServerErrorException> {
    const workbook = new ExcelJS.Workbook();

    try {
      await workbook.xlsx.load(file.buffer);
      const worksheet = workbook.worksheets[0];
      const rows = worksheet.getRows(2, worksheet.rowCount);

      let students: student[] = [];
      for (const row of rows) {
        if (row.getCell(1).value) {
          students.push({
            RegNo: Number(row.getCell(1).value),
            Faculty: row.getCell(2).value?.toString() ?? '',
            Name: row.getCell(3).value?.toString() ?? '',
            Batch: row.getCell(4).value ? Number(row.getCell(4).value) : null
          });
        }
      }

      students = this.filterEmptyRows(students);

      if (students.length === 0) {
        return new BadRequestException('No students found in the uploaded file');
      }

      return students;
    } catch (error) {
      return new InternalServerErrorException(
        'Something went wrong while extracting data from students list'
      );
    }
  }

  async addManyStudents(students: student[]) {
    try {
      const studentsList = await this.prismaService.student.createMany({
        data: students,
        skipDuplicates: true
      });
      return studentsList;
    } catch (error: any) {
      return new InternalServerErrorException(`Something went wrong. ${error}`);
    }
  }

  private filterEmptyRows(data) {
    return data.filter(row =>
      Object.values(row).every(value => value !== '' && value !== null && value !== undefined)
    );
  }
}
