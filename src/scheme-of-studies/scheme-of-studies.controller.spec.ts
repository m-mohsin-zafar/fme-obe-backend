import { Test, TestingModule } from '@nestjs/testing';
import { SchemeOfStudiesController } from './scheme-of-studies.controller';

describe('SchemeOfStudiesController', () => {
  let controller: SchemeOfStudiesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SchemeOfStudiesController],
    }).compile();

    controller = module.get<SchemeOfStudiesController>(SchemeOfStudiesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
