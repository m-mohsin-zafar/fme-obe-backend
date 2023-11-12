import { Test, TestingModule } from '@nestjs/testing';
import { PloController } from './plo.controller';

describe('PloController', () => {
  let controller: PloController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PloController],
    }).compile();

    controller = module.get<PloController>(PloController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
