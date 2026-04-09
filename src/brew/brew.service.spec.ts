import { Test, TestingModule } from '@nestjs/testing';
import { BrewService } from './brew.service';
import { TeapotException } from '../common/exceptions/teapot.exception';

describe('BrewService', () => {
  let service: BrewService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BrewService],
    }).compile();

    service = module.get<BrewService>(BrewService);
  });

  it('should explicitly refuse to brew tea by throwing a TeapotException', () => {
    expect(() => {
      service.brew({ teaType: 'Oolong' });
    }).toThrow(TeapotException);
  });
});
