import { Injectable } from '@nestjs/common';
import {
  HealthIndicator,
  HealthIndicatorResult,
  HealthCheckError,
} from '@nestjs/terminus';

/**
 * Health indicator for the kettle temperature.
 */
@Injectable()
export class KettleHealthIndicator extends HealthIndicator {
  /**
   * Checks the health of the kettle.
   *
   * @returns {Promise<HealthIndicatorResult>} Always returns degraded.
   */
  async checkHealth(): Promise<HealthIndicatorResult> {
    const result = this.getStatus('kettle', false, {
      kettleTemperature: 'too_cold',
    });
    throw new HealthCheckError('Kettle health check failed', result);
  }
}
