// src/middlewares/errorHandler.test.ts
import request from 'supertest';
import express, { Request, Response, NextFunction } from 'express';
import { ValidateError } from 'tsoa';
import { errorHandler } from '@/src/middlewares/error/error-handler'; // Adjust the import based on your project structure

// Create a mock app to test the middleware
const app = express();

// Middleware to simulate routes and errors
app.use('/validate-error', (_req: Request, _res: Response, next: NextFunction) => {
  const error = new ValidateError({}, 'Validation Error');
  next(error);
});

app.use('/generic-error', (_req: Request, _res: Response, next: NextFunction) => {
  const error = new Error('Generic Error');
  next(error);
});

app.use('/non-error', (_req: Request, _res: Response, next: NextFunction) => {
  next('This is a string error'); // Non-error object
});

// Attach the error handler middleware
app.use(errorHandler);

// Middleware to handle 404 Not Found
app.use((_req: Request, res: Response) => {
  res.status(404).json({ message: 'Not Found' });
});

describe('ErrorHandler Middleware', () => {
  it('should handle ValidateError and return 422 status', async () => {
    const response = await request(app).get('/validate-error');
    expect(response.status).toBe(422);
    expect(response.body.message).toBe('Validation Failed');
    expect(response.body.details).toEqual({});
  });

  it('should handle generic errors and return 500 status', async () => {
    const response = await request(app).get('/generic-error');
    expect(response.status).toBe(500);
    expect(response.body.message).toBe('Generic Error');
  });

  it('should pass non-error object to next middleware', async () => {
    const response = await request(app).get('/non-error');
    expect(response.status).toBe(500); // Expecting 500 because it's treated as an unexpected error
  });
});
