import { Test, TestingModule } from '@nestjs/testing';
import { HealthController } from './health.controller';

import { HealthCheckService } from '@nestjs/terminus';
import { KettleHealthIndicator } from './indicators/kettle.health';
import { WaterLevelHealthIndicator } from './indicators/water-level.health';
import { TeaBagHealthIndicator } from './indicators/tea-bag.health';

describe('HealthController', () => {
  let controller: HealthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [
        { provide: HealthCheckService, useValue: {} },
        { provide: KettleHealthIndicator, useValue: {} },
        { provide: WaterLevelHealthIndicator, useValue: {} },
        { provide: TeaBagHealthIndicator, useValue: {} },
      ],
    }).compile();

    controller = module.get<HealthController>(HealthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
