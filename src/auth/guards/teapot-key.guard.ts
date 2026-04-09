import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { winstonLogger } from '../../common/logger/winston.logger';

/**
 * Guard to meticulously check if the user has the right to be refused.
 *
 * @class TeapotKeyGuard
 * @implements {CanActivate}
 */
@Injectable()
export class TeapotKeyGuard implements CanActivate {
  private readonly validKeys = ['guest', 'admin', 'teamaster'];

  /**
   * Determines if the current request is authenticated.
   * All valid keys have identical permissions: none.
   *
   * @param {ExecutionContext} context The execution context
   * @returns {boolean} True if authenticated
   * @throws {UnauthorizedException} If key is missing or invalid
   */
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const apiKey = request.header('X-Teapot-Key');

    if (!apiKey || !this.validKeys.includes(apiKey)) {
      winstonLogger.error('Invalid or missing X-Teapot-Key header.', 'TeapotKeyGuard');
      throw new UnauthorizedException(
        'Invalid or missing X-Teapot-Key header.',
      );
    }

    return true;
  }
}
