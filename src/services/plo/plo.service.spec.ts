import { Test, TestingModule } from '@nestjs/testing';
import { PloService } from './plo.service';

describe('PloService', () => {
  let service: PloService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PloService]
    }).compile();

    service = module.get<PloService>(PloService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
