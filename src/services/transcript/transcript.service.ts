import { PLOAttainment } from './../../models/ploAttainment.model';
import { StudentService } from './../student/student.service';
import { PrismaService } from './../prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { CourseService } from '../course/course.service';
import { UtilitiesService } from '../utilities/utilities.service';

@Injectable()
export class TranscriptService {
  semesterLookup = {
    Spring: 1,
    Summer: 2,
    Fall: 3
  };

  constructor(
    private readonly prisma: PrismaService,
    private readonly student: StudentService,
    private readonly course: CourseService,
    private readonly utilities: UtilitiesService
  ) {}

  async getTranscriptByRegNo(regNo: number) {
    const student = await this.student.getStudentById(regNo);
    const courses = await this.course.getSchemeCoursesByBatch(student.Batch);

    let codes = [];
    courses.forEach(course => {
      codes.push(course.CourseCode);
    });

    let ploAttainment: PLOAttainment[] = await this.course.getPLOAttainmentByRegNoAndCourses(
      regNo,
      codes
    );

    if (ploAttainment) {
      for (const individualCourse of ploAttainment) {
        const course = await this.course.getCourseTitleByCourseCode(individualCourse.CourseCode);
        individualCourse['courseTitle'] = course.CourseTitle;
      }
    }

    ploAttainment.forEach(obj => {
      let [semType, year] = obj.Semester.split(' ');
      obj['semType'] = this.semesterLookup[semType];
      obj['year'] = year;
    });

    let tmpResult = {};
    for (let row of ploAttainment) {
      if (!Object.keys(tmpResult).includes(row.year)) {
        tmpResult[row.year] = {};
      }
      if (!Object.keys(tmpResult[row.year]).some(el => el == row.semType)) {
        tmpResult[row.year][row.semType] = [];
      }
      tmpResult[row.year][row.semType].push(row);
    }

    let transcript = {
      reg: student.RegNo,
      name: student.Name,
      faculty: student.Faculty,
      batch: student.Batch,
      result: tmpResult
    };
    return transcript;
  }

  async getTranscriptsByBatch(batch: number) {
    try {
      let students = await this.student.getStudentsRegNosByBatch(batch);
      // Only for demo purposes
      // students = students.slice(0, 4);
      await this.utilities.clearAllFiles();

      for (let student of students) {
        let transcript = await this.getTranscriptByRegNo(student);
        await this.utilities.generatePDF(transcript);
      }
      const zipFileName = `transcripts_${batch}.zip`;
      const zipped = await this.utilities.createZipArchive(zipFileName);
      return zipped;
    } catch (error) {
      return error;
    }
  }
}
