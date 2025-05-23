import { Router } from 'express';
import productsRouter from '@modules/products/infra/http/routes/products.routes';
import usersRouter from '@modules/users/infra/http/routes/user.routes';
import sessionsRouter from '@modules/users/infra/http/routes/sessions.routes';
import passwordRouter from '@modules/users/infra/http/routes/password.routes';
import profileRouter from '@modules/users/infra/http/routes/profile.routes';

import { ensureTier } from '../middlewares/ensureTier';
import scrapyRouter from './scrapy.routes';
import { SubscriptionTier } from '@modules/subscriptions/enums/subscription-tier.enum';
import shippingRoutes from '@modules/shipping/infra/http/routes/shipping.routes';

const routes = Router();

routes.use('/products', productsRouter);
routes.use('/users', usersRouter);
routes.use('/sessions', sessionsRouter);
routes.use('/password', passwordRouter);
routes.use('/profile', profileRouter);
routes.use('scrapy', scrapyRouter);
routes.use('/shipping', shippingRoutes);

routes.get('/area-prata', ensureTier(SubscriptionTier.SILVER), (req, res) => {
  res.json({ message: 'Conteúdo disponível para usuários SILVER ou superior' });
});

export default routes;
