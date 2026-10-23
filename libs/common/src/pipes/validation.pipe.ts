import { ValidationPipe } from '@nestjs/common';

/**
 * Pre-configured validation pipe with sensible production defaults:
 * - `whitelist: true` strips unknown properties
 * - `forbidNonWhitelisted: true` returns a 400 for extra fields
 * - `transform: true` auto-converts query/param primitives
 */
export const defaultValidationPipe = new ValidationPipe({
  whitelist: true,
  transform: true,
  forbidNonWhitelisted: true,
  transformOptions: {
    enableImplicitConversion: true,
  },
});
