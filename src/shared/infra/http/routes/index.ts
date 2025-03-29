import { Router } from 'express';
import productsRouter from '@modules/products/infra/http/routes/products.routes';
import usersRouter from '@modules/users/infra/http/routes/user.routes';
import sessionsRouter from '@modules/users/infra/http/routes/sessions.routes';
import passwordRouter from '@modules/users/infra/http/routes/password.routes';
import profileRouter from '@modules/users/infra/http/routes/profile.routes';
import customersRouter from '@modules/customers/infra/http/routes/customers.routes';
import ordersRouter from '@modules/orders/infra/http/routes/orders.routes';
import fetchTestRouter from './fetchR.routes';
import postTestRouter from './fetchPost.routes';
import fetchTestRouter2 from './fetchRANTIGA.routes';
import authPostRouter from './authMl.routes';
import postTestRouter_fet from './scrappML.routes';

const routes = Router();

routes.use('/products', productsRouter);
routes.use('/users', usersRouter);
routes.use('/sessions', sessionsRouter);
routes.use('/password', passwordRouter);
routes.use('/profile', profileRouter);
routes.use('/customers', customersRouter);
routes.use('/orders', ordersRouter);
routes.use('/api', fetchTestRouter2);
routes.use('/api', postTestRouter);
routes.use('/api', fetchTestRouter);
routes.use('/auth', authPostRouter);
routes.use('/scrap', postTestRouter_fet);

export default routes;
