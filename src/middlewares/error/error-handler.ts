// src/middlewares/errorHandler.ts
import { Request, Response, NextFunction } from 'express';
import { ValidateError } from 'tsoa';

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction): void {
  if (err instanceof ValidateError) {
    console.warn(`Caught Validation Error for ${req.path}:`, err.fields);
    res.status(422).json({
      message: 'Validation Failed',
      details: err?.fields,
    });
  } else if (err instanceof Error) {
    console.error(`Error: ${err.message}`);
    res.status(500).json({
      message: err.message,
    });
  } else {
    next(err);
  }
}
