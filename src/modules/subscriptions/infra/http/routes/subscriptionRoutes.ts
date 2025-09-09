import { Router } from 'express';
import SubscriptionController from '../controllers/SubscriptionController';
import CheckSubscriptionStatusController from '../controllers/CheckSubscriptionStatusController';

import isAuthenticated from '@shared/infra/http/middlewares/isAuthenticated';


const subscriptionRouter = Router();
const subscriptionController = new SubscriptionController();

subscriptionRouter.post('/', subscriptionController.create);

const checkStatusController = new CheckSubscriptionStatusController();


subscriptionRouter.get(
  '/status',
  isAuthenticated, // middleware que garante que o usuário está logado
  checkStatusController.show,
);

export default subscriptionRouter;
