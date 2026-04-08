import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import * as crypto from 'crypto';
import { Request } from 'express';
import * as winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'teapot-refusals.log' }),
  ],
});

/**
 * Enterprise logging interceptor to meticulously record all the times we do not brew tea.
 */
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  /**
   * Intercepts the request, logs enterprise metrics.
   *
   * @param {ExecutionContext} context The execution context
   * @param {CallHandler} next The next call handler
   * @returns {Observable<any>} The response stream
   */
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest<Request>();
    const startTime = Date.now();
    const requestId = crypto.randomUUID();
    const traceId =
      (request.headers['x-trace-id'] as string) || crypto.randomUUID();

    return next.handle().pipe(
      tap({
        error: () => {
          this.log(request, startTime, requestId, traceId, 'refused');
        },
        next: () => {
          this.log(request, startTime, requestId, traceId, 'refused');
        },
      }),
    );
  }

  private log(
    request: Request,
    startTime: number,
    requestId: string,
    traceId: string,
    outcome: string,
  ) {
    const durationMs = Date.now() - startTime;
    const body = request.body as { teaType?: string } | undefined;
    const isCoffee = request.path.includes('coffee');

    const logData = {
      requestId,
      timestamp: new Date().toISOString(),
      method: request.method,
      path: request.path,
      teaRequested: body?.teaType ?? 'unknown',
      outcome,
      durationMs,
      clientIp: request.ip,
      traceId,
    };

    if (isCoffee) {
      logger.warn('Coffee request detected — issuing immediate rejection', logData);
    } else {
      logger.info('Refused to brew tea', logData);
    }
  }
}
