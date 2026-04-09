import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HealthController } from './health.controller';
import { KettleHealthIndicator } from './indicators/kettle.health';
import { WaterLevelHealthIndicator } from './indicators/water-level.health';
import { TeaBagHealthIndicator } from './indicators/tea-bag.health';

/**
 * Module responsible for assessing the operational capability
 * of the teapot service.
 */
@Module({
  imports: [TerminusModule],
  controllers: [HealthController],
  providers: [
    KettleHealthIndicator,
    WaterLevelHealthIndicator,
    TeaBagHealthIndicator,
  ],
})
export class HealthModule {}
