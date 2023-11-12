import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CourseService {
  constructor(private readonly prisma: PrismaService) {}

  async getSchemeCoursesByBatch(batch: number) {
    return this.prisma.schemeofstudy.findMany({
      where: {
        Batch: batch,
      },
      select: {
        Semester: true,
        CourseCode: true,
      },
      orderBy: {
        Semester: 'asc',
      },
    });
  }

  async getPLOAttainmentByRegNoAndCourses(regNo: number, codes: any[]) {
    return this.prisma.courseplo.findMany({
      select: {
        Semester: true,
        // CourseTitle: true,
        CourseCode: true,
        PLO1: true,
        PLO2: true,
        PLO3: true,
        PLO4: true,
        PLO5: true,
        PLO6: true,
        PLO7: true,
        PLO8: true,
        PLO9: true,
        PLO10: true,
        PLO11: true,
        PLO12: true,
      },
      where: {
        AND: [
          {
            RegNo: regNo,
          },
          {
            CourseCode: { in: codes },
          },
        ],
      },
    });
  }

  async getCourseTitleByCourseCode(code: string) {
    return this.prisma.schemeofstudy.findFirst({
      where: {
        CourseCode: code,
      },
      select: {
        CourseTitle: true,
      },
    });
  }
}
