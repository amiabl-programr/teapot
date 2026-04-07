import { Injectable } from '@nestjs/common';
import { Counter, Gauge, collectDefaultMetrics, Registry } from 'prom-client';

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
    this.registry = new Registry();
    collectDefaultMetrics({ register: this.registry });

    this.brewAttemptsTotal = new Counter({
      name: 'teapot_brew_attempts_total',
      help: 'Total number of times someone foolishly attempted to brew tea',
      registers: [this.registry],
    });

    this.brewRefusalsTotal = new Counter({
      name: 'teapot_brew_refusals_total',
      help: 'Total number of times the teapot rightfully refused to brew (should match attempts)',
      registers: [this.registry],
    });

    this.coffeeRequestsTotal = new Counter({
      name: 'teapot_coffee_requests_total',
      help: 'Total number of heresy (coffee) requests',
      registers: [this.registry],
    });

    this.uptimeSeconds = new Counter({
      name: 'teapot_uptime_seconds',
      help: 'How long the teapot process has been complaining',
      registers: [this.registry],
    });

    this.waterLevelGauge = new Gauge({
      name: 'teapot_water_level_gauge',
      help: 'Current water level in the teapot (always 0.0)',
      registers: [this.registry],
    });
    this.waterLevelGauge.set(0.0);

    this.temperatureCelsiusGauge = new Gauge({
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
