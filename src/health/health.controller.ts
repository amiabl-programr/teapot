import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { HealthCheckService, HealthCheck, HealthIndicatorResult } from '@nestjs/terminus';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { KettleHealthIndicator } from './indicators/kettle.health';
import { WaterLevelHealthIndicator } from './indicators/water-level.health';
import { TeaBagHealthIndicator } from './indicators/tea-bag.health';
import { setTimeout } from 'timers/promises';

/**
 * Controller for comprehensive health diagnostics.
 * Spoilers: Not healthy.
 */
@ApiTags('health')
@Controller('health')
export class HealthController {
  private isFirstStartupCall = true;

  constructor(
    private health: HealthCheckService,
    private kettleIndicator: KettleHealthIndicator,
    private waterLevelIndicator: WaterLevelHealthIndicator,
    private teaBagIndicator: TeaBagHealthIndicator,
  ) {}

  /**
   * Simple liveness probe.
   *
   * @returns {object} Liveness status
   */
  @Get('live')
  @ApiOperation({ summary: 'Simple liveness probe' })
  public getLiveness() {
    return { status: 'alive', note: 'tragically' };
  }

  /**
   * Readiness probe. Evaluates true readiness of the teapot.
   *
   * @returns {Promise<HealthIndicatorResult>} Status
   */
  @Get('ready')
  @HealthCheck()
  @ApiOperation({ summary: 'Readiness probe' })
  public async getReadiness() {
    return this.health.check([
      () => this.kettleIndicator.checkHealth(),
      () => this.waterLevelIndicator.checkHealth(),
      () => this.teaBagIndicator.checkHealth(),
    ]);
  }

  /**
   * Startup probe. Fakes a delay on first call.
   *
   * @returns {Promise<object>}
   */
  @Get('startup')
  @ApiOperation({ summary: 'Startup probe' })
  public async getStartup() {
    if (this.isFirstStartupCall) {
      await setTimeout(3000);
      this.isFirstStartupCall = false;
    }
    return { status: 'up' };
  }
}
