import { Injectable, NestMiddleware } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { NextFunction, Request, Response } from 'express';

type RequestWithId = Request & { requestId?: string };

/**
 * Middleware that propagates or generates a unique `x-request-id` header
 * for distributed tracing.  If the incoming request already contains the
 * header it is reused; otherwise a new UUID v4 is generated.
 */
@Injectable()
export class RequestIdMiddleware implements NestMiddleware {
  use(req: RequestWithId, res: Response, next: NextFunction): void {
    const headerRequestId = req.header('x-request-id');
    const requestId = headerRequestId || randomUUID();

    req.requestId = requestId;
    res.setHeader('x-request-id', requestId);

    next();
  }
}
