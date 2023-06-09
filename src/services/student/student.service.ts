import { PrismaService } from './../prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

@Injectable()
export class StudentService {
    constructor(private prismaService: PrismaService) { }

    async getAllBatches() {
        let batches = await this.prismaService.student.findMany({
            select: {
                Batch: true
            },
            distinct: ['Batch']
        })
        return batches.map((student) => student.Batch);
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
                RegNo: "asc"
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
        return students.map((student) => student.RegNo);
    }
}
