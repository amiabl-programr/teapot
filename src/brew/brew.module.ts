import { Module } from '@nestjs/common';
import { BrewController } from './brew.controller';
import { BrewService } from './brew.service';
import { MetricsService } from '../metrics/metrics.service';

@Module({
  controllers: [BrewController],
  providers: [BrewService, MetricsService],
})
export class BrewModule {}
