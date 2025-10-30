import "reflect-metadata"; // necessário para TSyringe e TypeORM
import "../../../shared/container"; // registrar todos os providers antes de usar controllers
import "../typeorm/data-source";

import '@shared/infra/cron'; // ✅ Importa e inicializa todos os CRONs

import express, { NextFunction, Request, Response } from "express";
import "express-async-errors";
import cors from "cors";
import session from "express-session";
import { errors } from "celebrate";
import routes from "./routes";
import AppError from "../../../shared/errors/AppError";
import uploadConfig from "@config/upload";
import rateLimiter from "./middlewares/rateLimiter";
import errorHandler from "./middlewares/errorHandler";

// Cron de daily bonus
//import { scheduleDailyBonus } from "../cron/dailyBonus.cron";

const app = express();

// Inicializa cron de daily bonus
//scheduleDailyBonus();

// Configuração de sessão (necessária para /scrap/once)
app.use(
  session({
    secret: process.env.SESSION_SECRET || "default_secret",
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 1000 * 60 * 60 }, // 1h
  })
);

app.use(cors());
app.use(express.json());
app.use(rateLimiter);
app.use("/files", express.static(uploadConfig.directory));

// ROTAS
app.use(routes);

// Celebrate errors
app.use(errors());

// Middleware global de tratamento de erros
app.use(
  (error: Error, request: Request, response: Response, next: NextFunction) => {
    if (error instanceof AppError) {
      return response.status(error.statusCode).json({
        status: "error",
        message: error.message,
      });
    }

    console.error(error); // log completo no servidor
    return response.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
);

// Se necessário, também pode usar um middleware final de errorHandler separado
app.use(errorHandler);

export { app };
