// src/shared/infra/http/routes/index.ts
import { Router } from 'express';

import productsRouter from '@modules/products/infra/http/routes/products.routes';
import usersRouter from '@modules/users/infra/http/routes/user.routes';
import sessionsRouter from '@modules/users/infra/http/routes/sessions.routes';
import passwordRouter from '@modules/users/infra/http/routes/password.routes';
import profileRouter from '@modules/users/infra/http/routes/profile.routes';
import userAdminRouter from '@modules/users/infra/http/routes/user.admin.routes';
import testRouter from '@modules/users/infra/http/routes/tester.routes';

import userItemsRouter from '@modules/user_items/infra/http/routes/user-items.routes';
import savedItemsRouter from '@modules/saved-items/infra/http/routes/saved-item.routes';
import itemsRouter from '@modules/item/infra/http/routes/items.routes';
import itemScrapeLogRoutes from '@modules/item_scrape_log/infra/http/routes/itemScrapeLog.routes';

import scrapyRouter from './scrapy.routes';
import scrapRoutes from '@modules/scrap/infra/http/routes/scrap.routes';
import scrapDevRouter from '@modules/scrap/infra/http/routes/scrapDev.routes';

import shippingRoutes from '@modules/shipping/infra/http/routes/shipping.routes';
import subscriptionRouter from '@modules/subscriptions/infra/http/routes/subscriptionRoutes';

import { ensureTier } from '../middlewares/ensureTier';
import { SubscriptionTier } from '@modules/subscriptions/enums/subscription-tier.enum';

const routes = Router();

// ===== User Items =====
routes.use('/user_items', userItemsRouter);

// ===== Users =====
routes.use('/users', usersRouter);
routes.use('/users/admin', userAdminRouter);
routes.use('/sessions', sessionsRouter);
routes.use('/password', passwordRouter);
routes.use('/profile', profileRouter);

// ===== Products & Items =====
routes.use('/products', productsRouter);
routes.use('/items', itemsRouter);
routes.use('/saved-items', savedItemsRouter);

// ===== Scrap =====
routes.use('/scrapy', scrapyRouter);
routes.use('/scrap', scrapRoutes);           // scrap rotas auth
routes.use('/scrap-dev', scrapDevRouter);   // dev apenas
routes.use('/items-scrap-log', itemScrapeLogRoutes);

// ===== Shipping & Subscriptions =====
routes.use('/shipping', shippingRoutes);
routes.use('/subscriptions', subscriptionRouter);

// ===== Test & Misc =====
routes.use('/test-user', testRouter);

routes.get('/area-prata', ensureTier(SubscriptionTier.SILVER), (req, res) => {
  res.json({ message: 'Conteúdo disponível para usuários SILVER ou superior' });
});

export default routes;
