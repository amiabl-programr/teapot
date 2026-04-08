import { Injectable } from '@nestjs/common';
import {
  HealthIndicator,
  HealthIndicatorResult,
  HealthCheckError,
} from '@nestjs/terminus';

/**
 * Health indicator for the water level.
 */
@Injectable()
export class WaterLevelHealthIndicator extends HealthIndicator {
  /**
   * Checks the water level. True to form, the teapot is empty.
   *
   * @returns {Promise<HealthIndicatorResult>} Always degraded.
   */
  checkHealth(): HealthIndicatorResult {
    const result = this.getStatus('waterLevel', false, { waterLevel: 0.0 });
    throw new HealthCheckError('Teapot is empty', result);
  }
}
