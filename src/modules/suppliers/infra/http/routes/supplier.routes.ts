import { Router } from 'express';
import { celebrate, Joi, Segments } from 'celebrate';
import isAuthenticated from '@shared/infra/http/middlewares/isAuthenticated';
import SuppliersRepository from '@modules/suppliers/infra/typeorm/repositories/SuppliersRepository';
import CreateSupplierService from '@modules/suppliers/services/CreateSupplierService';
import UpdateSupplierService from '@modules/suppliers/services/UpdateSupplierService';

const supplierRouter = Router();

// Repositories and services
const suppliersRepository = new SuppliersRepository();
const createSupplierService = new CreateSupplierService(suppliersRepository);
const updateSupplierService = new UpdateSupplierService(suppliersRepository);

// Authentication middleware
supplierRouter.use(isAuthenticated);

// Create supplier route
supplierRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: Joi.object({
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      phone: Joi.string().required(),
      type: Joi.string().valid('mercadoLivre', 'olx', 'custom').required(),
      address: Joi.object({
        street: Joi.string(),
        number: Joi.string(),
        complement: Joi.string().optional(),
        neighborhood: Joi.string(),
        city: Joi.string(),
        state: Joi.string(),
        cep: Joi.string(),
      })
        .optional()
        .when('type', { is: 'custom', then: Joi.required() }), // address required only for custom suppliers
    }),
  }),
  async (req, res) => {
    try {
      const { name, email, phone, address, type } = req.body;
      const supplier = await createSupplierService.execute({
        name,
        email,
        phone,
        address,
        type,
      });
      return res.status(201).json(supplier);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  },
);

// Update supplier route
supplierRouter.put(
  '/:id',
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.string().uuid().required(),
    },
    [Segments.BODY]: Joi.object({
      name: Joi.string().optional(),
      email: Joi.string().email().optional(),
      phone: Joi.string().optional(),
      type: Joi.string().valid('mercadoLivre', 'olx', 'custom').optional(),
      address: Joi.object({
        street: Joi.string(),
        number: Joi.string(),
        complement: Joi.string().optional(),
        neighborhood: Joi.string(),
        city: Joi.string(),
        state: Joi.string(),
        cep: Joi.string(),
      })
        .optional()
        .when('type', { is: 'custom', then: Joi.required() }), // address required for custom suppliers
    }),
  }),
  async (req, res) => {
    try {
      const { id } = req.params;
      const { name, email, phone, address, type } = req.body;
      const supplier = await updateSupplierService.execute(id, {
        name,
        email,
        phone,
        address,
        type,
      });
      return res.json(supplier);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  },
);

// Get suppliers by type
supplierRouter.get(
  '/type/:type',
  celebrate({
    [Segments.PARAMS]: {
      type: Joi.string().valid('mercadoLivre', 'olx', 'custom').required(),
    },
  }),
  async (req, res) => {
    try {
      const { type } = req.params;
      const suppliers = await suppliersRepository.findByType(
        type as 'mercadoLivre' | 'olx' | 'custom',
      );
      return res.json(suppliers);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  },
);

// Delete supplier (optional, if you want to add this functionality)
supplierRouter.delete(
  '/:id',
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.string().uuid().required(),
    },
  }),
  async (req, res) => {
    try {
      const { id } = req.params;
      const supplier = await suppliersRepository.findById(id);
      if (!supplier) {
        return res.status(404).json({ error: 'Supplier not found' });
      }
      await suppliersRepository.remove(supplier);
      return res.status(204).send(); // No content
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  },
);

export default supplierRouter;
