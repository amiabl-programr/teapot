import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  NotFoundException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { join } from 'path';

/**
 * Filter to catch all 404 Not Found exceptions.
 * Differentiates between API requests (returns JSON) and client requests (returns 404.html).
 *
 * @class NotFoundExceptionFilter
 * @implements {ExceptionFilter}
 */
@Catch(NotFoundException)
export class NotFoundExceptionFilter implements ExceptionFilter {
  catch(exception: NotFoundException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    // If it's an API route or expects JSON, return a standard strict JSON 404
    if (
      request.url.startsWith('/api') ||
      request.headers.accept?.includes('application/json')
    ) {
      response.status(status).json({
        statusCode: status,
        error: 'Not Found',
        message: `Endpoint ${request.url} categorically does not exist here.`,
      });
      return;
    }

    // Otherwise, serve the enterprise 404 HTML page
    const publicPath =
      process.env.NODE_ENV === 'production'
        ? join(__dirname, '..', '..', '..', 'public') // From dist/common/filters
        : join(process.cwd(), 'src', 'public');

    response.status(status).sendFile(join(publicPath, '404.html'));
  }
}
