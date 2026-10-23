import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';

/** Maps HTTP status codes to machine-readable error code strings. */
const STATUS_CODE_MAP: Record<number, string> = {
  400: 'BAD_REQUEST',
  401: 'UNAUTHORIZED',
  403: 'FORBIDDEN',
  404: 'NOT_FOUND',
  405: 'METHOD_NOT_ALLOWED',
  409: 'CONFLICT',
  410: 'GONE',
  413: 'PAYLOAD_TOO_LARGE',
  415: 'UNSUPPORTED_MEDIA_TYPE',
  422: 'UNPROCESSABLE_ENTITY',
  429: 'TOO_MANY_REQUESTS',
  500: 'INTERNAL_ERROR',
  502: 'BAD_GATEWAY',
  503: 'SERVICE_UNAVAILABLE',
  504: 'GATEWAY_TIMEOUT',
};

/**
 * Global exception filter that catches all errors and returns a consistent
 * JSON error envelope: `{ error: { code, message, requestId, timestamp } }`.
 */
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const context = host.switchToHttp();
    const response = context.getResponse<{
      status: (code: number) => { json: (payload: unknown) => void };
    }>();
    const request = context.getRequest<{ requestId?: string }>();

    const status =
      exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException ? exception.message : 'Unexpected internal server error';

    const code = STATUS_CODE_MAP[status] ?? 'INTERNAL_ERROR';

    response.status(status).json({
      error: {
        code,
        message,
        requestId: request.requestId ?? 'unknown',
        timestamp: new Date().toISOString(),
      },
    });
  }
}
