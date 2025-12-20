// src/shared/infra/http/app.ts

import 'reflect-metadata';
import '../../../shared/container';
import '../typeorm/data-source';
//import '@shared/infra/cron';

import express, { NextFunction, Request, Response } from 'express';
import 'express-async-errors';
import cors from 'cors';
import session from 'express-session';
import { errors } from 'celebrate';

import routes from './routes';
import AppError from '../../../shared/errors/AppError';
import uploadConfig from '@config/upload';
import rateLimiter from './middlewares/rateLimiter';
import errorHandler from './middlewares/errorHandler';

const app = express();

/**
 * 🧩 Sessão — usada por rotas específicas (ex: /scrap/once)
 */
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'default_secret',
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 1000 * 60 * 60, // 1h
    },
  }),
);

/**
 * 🌐 CORS e JSON parser
 */
app.use(cors());
app.use(express.json());

/**
 * 🚦 Rate limiter — protege contra abuso de requisições
 */
app.use(rateLimiter);

/**
 * 📂 Servir arquivos estáticos (ex: uploads de avatar)
 */
app.use('/files', express.static(uploadConfig.directory));

/**
 * 🚀 Rotas principais da aplicação
 *
 * As rotas internas já possuem seus middlewares de autenticação
 * e o populateSubscription é aplicado internamente, após o ensureAuthenticated.
 */
app.use(routes);

/**
 * ⚠️ Tratamento de erros de validação do Celebrate (Joi)
 */
app.use(errors());

/**
 * 🛑 Middleware global para capturar exceções do AppError
 * e falhas inesperadas de runtime.
 */
app.use(
  (
    error: Error,
    request: Request,
    response: Response,
    _next: NextFunction,
  ) => {
    if (error instanceof AppError) {
      return response.status(error.statusCode).json({
        status: 'error',
        message: error.message,
      });
    }

    console.error('🔥 [Unhandled Error]:', error);

    return response.status(500).json({
      status: 'error',
      message: 'Internal server error',
    });
  },
);

/**
 * 🚒 Middleware final customizado
 * (para logs ou ajustes globais após o tratamento principal)
 */
app.use(errorHandler);

export { app };
