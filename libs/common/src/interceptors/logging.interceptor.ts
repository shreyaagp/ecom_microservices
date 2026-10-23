import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

/**
 * Global interceptor that logs the HTTP method, URL, duration (ms) and
 * request-id for every incoming request.
 */
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  /** Log request details after the response is sent. */
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const now = Date.now();
    const request = context.switchToHttp().getRequest<{
      method?: string;
      originalUrl?: string;
      requestId?: string;
    }>();

    return next
      .handle()
      .pipe(
        tap(() =>
          this.logger.log(
            `${request.method ?? 'UNKNOWN'} ${request.originalUrl ?? '/'} ${Date.now() - now}ms requestId=${request.requestId ?? 'unknown'}`,
          ),
        ),
      );
  }
}
