import { Router } from 'express';
import SubscriptionController from '../controllers/SubscriptionController';

const subscriptionRouter = Router();
const subscriptionController = new SubscriptionController();

subscriptionRouter.post('/', subscriptionController.create);

export default subscriptionRouter;
