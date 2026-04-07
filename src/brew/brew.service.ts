import { Injectable } from '@nestjs/common';
import { BrewRequestDto } from './dto/brew-request.dto';
import { TeapotException } from '../common/exceptions/teapot.exception';
import { MetricsService } from '../metrics/metrics.service';

/**
 * The core business logic service for the Teapot.
 * Relentlessly refuses to brew anything.
 *
 * @class BrewService
 */
@Injectable()
export class BrewService {
  /**
   * Instantiates the BrewService with necessary dependencies.
   * @param {MetricsService} metricsService The metrics service for tracking refusals
   */
  constructor(private readonly metricsService: MetricsService) {}

  /**
   * Attempts to begin the brewing process.
   * Always throws a TeapotException. No exceptions to the exception.
   *
   * @param {BrewRequestDto} dto The requested brew details
   * @returns {never}
   * @throws {TeapotException} Always.
   */
  public brew(dto: BrewRequestDto): never {
    // Increment enterprise counters
    this.metricsService.brewAttemptsTotal.inc();
    this.metricsService.brewRefusalsTotal.inc();

    throw new TeapotException(dto.teaType);
  }
}
