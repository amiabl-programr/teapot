import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { trace } from '@opentelemetry/api';

/**
 * Tracing interceptor to generate incredibly detailed OpenTelemetry spans
 * for an operation that does absolutely nothing.
 */
@Injectable()
export class TracingInterceptor implements NestInterceptor {
  /**
   * Intercept request and generate excessive spans.
   *
   * @param {ExecutionContext} ctx The context
   * @param {CallHandler} next The logic
   * @returns {Observable<any>} The result
   */
  intercept(ctx: ExecutionContext, next: CallHandler): Observable<any> {
    const tracer = trace.getTracer('teapot-tracer');

    const requestSpan = tracer.startSpan('http.server.request');
    
    const validateSpan = tracer.startSpan('teapot.validate_input');
    validateSpan.end();
    
    const waterSpan = tracer.startSpan('teapot.check_water');
    waterSpan.setAttribute('water_level', 'empty');
    waterSpan.end();
    
    const tempSpan = tracer.startSpan('teapot.check_temperature');
    tempSpan.setAttribute('temperature', 'cold');
    tempSpan.end();
    
    const brewSpan = tracer.startSpan('teapot.attempt_brew');
    brewSpan.setAttribute('brew_success', false);
    brewSpan.end();
    
    const refusalSpan = tracer.startSpan('teapot.generate_refusal');
    refusalSpan.setAttribute('status', 'success - refusal sent');
    refusalSpan.end();

    return next.handle().pipe(
      tap({
        error: () => requestSpan.end(),
        next: () => requestSpan.end(),
      }),
    );
  }
}
