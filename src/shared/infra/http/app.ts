import 'reflect-metadata';
import express, { NextFunction, Request, Response } from 'express';
import 'express-async-errors';
import cors from 'cors';
import session from 'express-session';
import { errors } from 'celebrate';
import routes from './routes';
import AppError from '../../../shared/errors/AppError';
import '../typeorm/data-source';
import '../../../shared/container';
import uploadConfig from '@config/upload';
import rateLimiter from './middlewares/rateLimiter';
import errorHandler from './middlewares/errorHandler';

const app = express();

app.use(errorHandler);


// Configuração de session (necessária para /scrap/once)
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'default_secret',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 1000 * 60 * 60 }, // 1h
  }),
);

app.use(cors());
app.use(express.json());
app.use(rateLimiter);
app.use('/files', express.static(uploadConfig.directory));
app.use(routes);

// Errors do Celebrate
app.use(errors());


// Tratamento de erros
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
      message: console.error(error),
    });
  },
);

export { app };
