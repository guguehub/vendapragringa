// src/modules/subscriptions/infra/http/routes/subscriptionRoutes.ts
import { Router } from 'express';
import SubscriptionController from '../controllers/SubscriptionController';
import CheckSubscriptionStatusController from '../controllers/CheckSubscriptionStatusController';
import isAuthenticated from '@shared/infra/http/middlewares/isAuthenticated';
import isAdmin from '@shared/infra/http/middlewares/isAdmin';
import populateSubscription from '@shared/infra/http/middlewares/populateSubscription';

const subscriptionRouter = Router();

// Controllers
const subscriptionController = new SubscriptionController();
const checkStatusController = new CheckSubscriptionStatusController();

/**
 * Criação de assinatura (somente admin)
 */
subscriptionRouter.post(
  '/',
  isAuthenticated,
  isAdmin,
  subscriptionController.create,
);

/**
 * Upgrade/Downgrade do tier (usuário logado)
 */
subscriptionRouter.put(
  '/upgrade',
  isAuthenticated,populateSubscription,
  subscriptionController.upgrade,
);

/**
 * Update geral da assinatura (somente admin)
 */
subscriptionRouter.put(
  '/update',
  isAuthenticated, populateSubscription,
  isAdmin,
  subscriptionController.update,
);

/**
 * Verifica status da assinatura do usuário logado
 */
subscriptionRouter.get(
  '/status',
  isAuthenticated, populateSubscription,
  checkStatusController.show,
);

export default subscriptionRouter;
