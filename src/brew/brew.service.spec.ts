import { Test, TestingModule } from '@nestjs/testing';
import { BrewService } from './brew.service';
import { MetricsService } from '../metrics/metrics.service';
import { TeapotException } from '../common/exceptions/teapot.exception';

describe('BrewService', () => {
  let service: BrewService;
  let metricsService: MetricsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BrewService,
        {
          provide: MetricsService,
          useValue: {
            brewAttemptsTotal: { inc: jest.fn() },
            brewRefusalsTotal: { inc: jest.fn() },
          },
        },
      ],
    }).compile();

    service = module.get<BrewService>(BrewService);
    metricsService = module.get<MetricsService>(MetricsService);
  });

  it('should explicitly refuse to brew tea by throwing a TeapotException', () => {
    expect(() => {
      service.brew({ teaType: 'Oolong' });
    }).toThrow(TeapotException);

    expect(metricsService.brewAttemptsTotal.inc).toHaveBeenCalled();
    expect(metricsService.brewRefusalsTotal.inc).toHaveBeenCalled();
  });
});
