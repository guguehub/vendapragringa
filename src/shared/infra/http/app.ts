import express, { NextFunction, Request, Response } from 'express';
import 'express-async-errors';
import cors from 'cors';
import { errors } from 'celebrate';
import routes from './routes';
//import AppError from '@shared/errors/AppError';
import AppError from '../../../shared/errors/AppError';
//import '@shared/infra/typeorm';
import '../../../shared/infra/typeorm';
//import '@shared/container';
import '../../../shared/container';
import uploadConfig from '@config/upload';
import rateLimiter from './middlewares/rateLimiter';
import scrapyRouter from './routes/scrapy.routes';

const app = express();

// Routes
const scrapRoutes = require('../../../shared/infra/http/routes/scrapy.routes');
app.use('/api', scrapyRouter);

app.use(cors());
app.use(express.json());
app.use(rateLimiter);
app.use('/files', express.static(uploadConfig.directory));
app.use(routes);

app.use(errors());

app.use(
  (error: Error, request: Request, response: Response, next: NextFunction) => {
    if (error instanceof AppError) {
      return response.status(error.statusCode).json({
        status: 'error',
        message: error.message,
      });
    }
    return response.status(500).json({
      status: 'error',
      message: console.log(error),
    });
  },
);
export { app };
