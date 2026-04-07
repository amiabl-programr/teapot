import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { Response } from 'express';
import { TeapotException } from '../exceptions/teapot.exception';

/**
 * Filter to catch all TeapotExceptions and ensure enterprise formatting.
 *
 * @class TeapotExceptionFilter
 * @implements {ExceptionFilter}
 */
@Catch(TeapotException)
export class TeapotExceptionFilter implements ExceptionFilter {
  /**
   * Catches the TeapotException and shapes the HTTP response.
   *
   * @param {TeapotException} exception The exception caught
   * @param {ArgumentsHost} host The arguments host
   */
  catch(exception: TeapotException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const responseBody = exception.getResponse();

    response.status(status).json(responseBody);
  }
}
