import { Test, TestingModule } from '@nestjs/testing';
import { SchemeOfStudiesService } from './scheme-of-studies.service';

describe('SchemeOfStudiesService', () => {
  let service: SchemeOfStudiesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SchemeOfStudiesService],
    }).compile();

    service = module.get<SchemeOfStudiesService>(SchemeOfStudiesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
