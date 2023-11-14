import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './services/prisma/prisma.service';
import { StudentController } from './student/student.controller';
import { StudentService } from './services/student/student.service';
import { TranscriptController } from './transcript/transcript.controller';
import { TranscriptService } from './services/transcript/transcript.service';
import { UtilitiesService } from './services/utilities/utilities.service';
import { CourseService } from './services/course/course.service';
import { PloController } from './plo/plo.controller';
import { SchemeOfStudiesController } from './scheme-of-studies/scheme-of-studies.controller';
import { SchemeOfStudiesService } from './services/scheme-of-studies/scheme-of-studies.service';
import { PloService } from './services/plo/plo.service';

@Module({
  imports: [],
  controllers: [AppController, StudentController, TranscriptController, PloController, SchemeOfStudiesController],
  providers: [
    AppService,
    PrismaService,
    StudentService,
    TranscriptService,
    UtilitiesService,
    CourseService,
    SchemeOfStudiesService,
    PloService,
  ],
})
export class AppModule {}
