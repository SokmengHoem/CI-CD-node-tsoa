import express, { Request, Response } from 'express';
import swaggerUi from "swagger-ui-express";
import { RegisterRoutes } from '@/src/routes/v1/routes';
import fs from 'fs';
import path from 'path'
import { errorHandler } from '@/src/middlewares/error/error-handler';

// Dynamically load swagger.json
const swaggerDocument = JSON.parse(fs.readFileSync(path.join(__dirname, 'docs/swagger.json'), 'utf8'));

// ========================
// Initialize App Express
// ========================
const app = express();


// ========================
// Global Middleware
// ========================
app.use(express.json())  // Help to get the json from request body


// ========================
// Global API V1
// ========================
RegisterRoutes(app)

//use handle error when req url wrong format HTTP Method
app.use("*", (_req:Request, res:Response) =>{
    res.status(404).json({ message: "Page not found" });
})

// ========================
// API Documentations
// ========================
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// ========================
// ERROR Handler
// ========================
app.use(errorHandler);

export default app;