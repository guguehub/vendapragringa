import { Router } from 'express';
import UserAddressController from '../controllers/UserAddressController';
import isAuthenticated from '@shared/infra/http/middlewares/isAuthenticated';

const addressRouter = Router();
const controller = new UserAddressController();

// 🔒 Protege todas as rotas
addressRouter.use(isAuthenticated);

// 🏗️ Rotas CRUD
addressRouter.post('/', controller.create);
addressRouter.get('/', controller.list);
addressRouter.get('/primary', controller.getPrimary);
addressRouter.put('/:id', controller.update);
addressRouter.delete('/:id', controller.delete);

export default addressRouter;
