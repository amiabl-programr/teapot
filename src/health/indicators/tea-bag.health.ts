import { Injectable } from '@nestjs/common';
import {
  HealthIndicator,
  HealthIndicatorResult,
  HealthCheckError,
} from '@nestjs/terminus';

/**
 * Health indicator for the tea bag inventory.
 */
@Injectable()
export class TeaBagHealthIndicator extends HealthIndicator {
  /**
   * Checks the tea bag stack.
   *
   * @returns {Promise<HealthIndicatorResult>} Always degraded.
   */
  checkHealth(): HealthIndicatorResult {
    const result = this.getStatus('teaBag', false, { teaBagInventory: 0 });
    throw new HealthCheckError('Out of tea bags', result);
  }
}
