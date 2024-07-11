import { NextFunction, Request, Response } from 'express';

const consoleUserShowTime = async (req: Request, _res: Response, next: NextFunction) => {
  const startTime = Date.now();

  // Assuming your user show logic is within a route handler named 'userShow'
  // Modify this based on your actual route handler name
  await next(); // Allow the request to continue to the userShow route handler

  const endTime = Date.now();
  const elapsedTime = endTime - startTime;

  console.log(`User show request (method: ${req.method}, path: ${req.path}) took ${elapsedTime}ms`);
};

export default consoleUserShowTime;
