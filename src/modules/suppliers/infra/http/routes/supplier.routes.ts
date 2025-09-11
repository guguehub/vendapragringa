import { Router } from 'express';
import SupplierController from '../controllers/SupplierController';

const supplierRouter = Router();
const controller = new SupplierController();

supplierRouter.get('/', controller.index);
supplierRouter.post('/', controller.create);
supplierRouter.put('/:id', controller.update);
supplierRouter.delete('/:id', controller.delete);

export default supplierRouter;
