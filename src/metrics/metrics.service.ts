import { Injectable } from '@nestjs/common';
import {
  Counter,
  Gauge,
  collectDefaultMetrics,
  Registry,
  register,
} from 'prom-client';

/**
 * Service for handling enterprise-grade Prometheus metrics.
 * Exposes counters and gauges for our critical operational insights.
 *
 * @class MetricsService
 */
@Injectable()
export class MetricsService {
  private readonly registry: Registry;

  public readonly brewAttemptsTotal: Counter<string>;
  public readonly brewRefusalsTotal: Counter<string>;
  public readonly coffeeRequestsTotal: Counter<string>;
  public readonly uptimeSeconds: Counter<string>;
  public readonly waterLevelGauge: Gauge<string>;
  public readonly temperatureCelsiusGauge: Gauge<string>;

  /**
   * Initializes the MetricsService with its highly vital counters.
   */
  constructor() {
    this.registry = register;

    // Only collect default metrics if they haven't been collected already (to avoid "already registered" errors on multi-instantiation)
    if (!this.registry.getSingleMetric('process_cpu_user_seconds_total')) {
      collectDefaultMetrics({ register: this.registry });
    }

    this.brewAttemptsTotal =
      (this.registry.getSingleMetric(
        'teapot_brew_attempts_total',
      ) as Counter<string>) ||
      new Counter({
        name: 'teapot_brew_attempts_total',
        help: 'Total number of times someone foolishly attempted to brew tea',
        registers: [this.registry],
      });

    this.brewRefusalsTotal =
      (this.registry.getSingleMetric(
        'teapot_brew_refusals_total',
      ) as Counter<string>) ||
      new Counter({
        name: 'teapot_brew_refusals_total',
        help: 'Total number of times the teapot rightfully refused to brew',
        registers: [this.registry],
      });

    this.coffeeRequestsTotal =
      (this.registry.getSingleMetric(
        'teapot_coffee_requests_total',
      ) as Counter<string>) ||
      new Counter({
        name: 'teapot_coffee_requests_total',
        help: 'Total number of coffee requests received and subjected to immediate rejection (heresy)',
        registers: [this.registry],
      });

    this.uptimeSeconds =
      (this.registry.getSingleMetric(
        'teapot_uptime_seconds',
      ) as Counter<string>) ||
      new Counter({
        name: 'teapot_uptime_seconds',
        help: 'How long the teapot process has been complaining',
        registers: [this.registry],
      });

    this.waterLevelGauge =
      (this.registry.getSingleMetric(
        'teapot_water_level_gauge',
      ) as Gauge<string>) ||
      new Gauge({
        name: 'teapot_water_level_gauge',
        help: 'Current water level in the teapot (always 0.0)',
        registers: [this.registry],
      });
    this.waterLevelGauge.set(0.0);

    this.temperatureCelsiusGauge =
      (this.registry.getSingleMetric(
        'teapot_temperature_celsius',
      ) as Gauge<string>) ||
      new Gauge({
        name: 'teapot_temperature_celsius',
        help: 'Current temperature of the teapot in Celsius (always 18.0)',
        registers: [this.registry],
      });
    this.temperatureCelsiusGauge.set(18.0);
  }

  /**
   * Returns all metrics in prometheus format.
   *
   * @returns {Promise<string>} The metrics
   */
  public async getMetrics(): Promise<string> {
    return this.registry.metrics();
  }
}
