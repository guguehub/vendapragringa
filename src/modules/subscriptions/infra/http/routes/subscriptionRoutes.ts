// src/modules/subscriptions/infra/http/routes/subscriptionRoutes.ts
import { Router } from 'express';
import SubscriptionController from '../controllers/SubscriptionController';
import CheckSubscriptionStatusController from '../controllers/CheckSubscriptionStatusController';
import isAuthenticated from '@shared/infra/http/middlewares/isAuthenticated';

const subscriptionRouter = Router();

// Controllers
const subscriptionController = new SubscriptionController();
const checkStatusController = new CheckSubscriptionStatusController();

// Criação de assinatura
subscriptionRouter.post(
  '/',
  isAuthenticated,
  subscriptionController.create,
);

// Atualização de assinatura (ex: mudar tier)
subscriptionRouter.put(
  '/update',
  isAuthenticated,
  subscriptionController.update,
);

// Verifica status da assinatura do usuário
subscriptionRouter.get(
  '/status',
  isAuthenticated,
  checkStatusController.show,
);

export default subscriptionRouter;
