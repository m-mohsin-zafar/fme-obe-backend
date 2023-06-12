import { StudentService } from './../services/student/student.service';
import { Controller, Get, NotFoundException, Param } from '@nestjs/common';

@Controller('/api/student')
export class StudentController {

    constructor(private readonly student: StudentService) { }

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
