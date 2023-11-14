import { FileInterceptor } from '@nestjs/platform-express';
import { StudentService } from './../services/student/student.service';
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Post,
  UploadedFile,
  UseInterceptors
} from '@nestjs/common';
import { student } from '@prisma/client';

@Controller('/api/student')
export class StudentController {
  constructor(private readonly student: StudentService) {}

  @Post('add-many')
  async addManyStudents(@Body() students: any[]) {
    try {
      const response = await this.student.addManyStudents(students);
      return response;
    } catch (error: any) {
      return new InternalServerErrorException('Something went wrong');
    }
  }

  // Verify Students List as Excel File (xlsx)
  @Post('upload/verify')
  @UseInterceptors(FileInterceptor('file'))
  async verifyStudents(@UploadedFile() file: Express.Multer.File) {
    try {
      // Validate the uploaded file
      if (!file) {
        return new NotFoundException('No File Uploaded');
      }
      if (file.mimetype !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
        return new BadRequestException('Invalid File Type');
      }
      const response = await this.student.extractStudentsDataFromExcelFile(file);
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
    } catch (error: any) {
      return new NotFoundException('No Students Found');
    }
  }

  @Get('batches')
  async getAllBatches() {
    try {
      const batches = await this.student.getAllBatches();
      return batches;
    } catch (error: any) {
      return new NotFoundException('No Batches Found');
    }
  }

  @Get('all')
  async getAllStudents() {
    try {
      const students = await this.student.getAllStudents();
      return students;
    } catch (error: any) {
      return new NotFoundException('No Students Found');
    }
  }

  @Get(':id')
  async getStudentById(@Param('id') id: String) {
    try {
      const student = await this.student.getStudentById(Number(id));
      return student;
    } catch (error: any) {
      return new NotFoundException('Student Not Found');
    }
  }

  @Get('batch/:batch')
  async getStudentsByBatch(@Param('batch') batch: String) {
    try {
      const students = await this.student.getStudentsByBatch(Number(batch));
      return students;
    } catch (error: any) {
      return new NotFoundException('No Students Found');
    }
  }
}
