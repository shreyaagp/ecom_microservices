import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

interface MetaPayload {
  requestId: string;
  timestamp: string;
}

/**
 * Wraps every successful response in a standard envelope:
 * `{ data, meta: { requestId, timestamp }, error: null }`.
 */
@Injectable()
export class ResponseEnvelopeInterceptor<T> implements NestInterceptor<
  T,
  { data: T; meta: MetaPayload; error: null }
> {
  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<{ data: T; meta: MetaPayload; error: null }> {
    const request = context.switchToHttp().getRequest<{ requestId?: string }>();

    return next.handle().pipe(
      map((data) => ({
        data,
        meta: {
          requestId: request.requestId ?? 'unknown',
          timestamp: new Date().toISOString(),
        },
        error: null,
      })),
    );
  }
}
