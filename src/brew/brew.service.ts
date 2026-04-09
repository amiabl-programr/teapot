import { Injectable } from '@nestjs/common';
import { BrewRequestDto } from './dto/brew-request.dto';
import { TeapotException } from '../common/exceptions/teapot.exception';

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
  constructor() {}

  /**
   * Attempts to begin the brewing process.
   * Always throws a TeapotException. No exceptions to the exception.
   *
   * @param {BrewRequestDto} dto The requested brew details
   * @returns {void}
   * @throws {TeapotException} Always.
   */
  public brew(dto: BrewRequestDto): void {
    throw new TeapotException(dto.teaType);
  }
}
