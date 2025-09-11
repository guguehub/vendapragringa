import { Request, Response } from 'express';
import { container } from 'tsyringe';

import CreateSupplierService from '@modules/suppliers/services/CreateSupplierService';
import UpdateSupplierService from '@modules/suppliers/services/UpdateSupplierService';
import RemoveSupplierService from '@modules/suppliers/services/RemoveSupplierService';
import ListSuppliersService from '@modules/suppliers/services/ListSuppliersService';
import AppError from '@shared/errors/AppError';

export default class SupplierController {
  // Lista todos os suppliers (opção clean)
  public async index(request: Request, response: Response): Promise<Response> {
    try {
      const listSuppliers = container.resolve(ListSuppliersService);
      const suppliers = await listSuppliers.execute();

      return response.json(suppliers);
    } catch (error: unknown) {
      if (error instanceof AppError) {
        return response.status(error.statusCode).json({ error: error.message });
      }
      console.error(error);
      return response.status(500).json({ error: 'Internal server error' });
    }
  }

  // Criação de supplier
  public async create(request: Request, response: Response): Promise<Response> {
    try {
      const {
        name,
        marketplace,
        external_id,
        email,
        link,
        website,
        url,
        address,
        city,
        state,
        country,
        zip_code,
        status,
        is_active,
      } = request.body;

      const createSupplier = container.resolve(CreateSupplierService);
      const supplier = await createSupplier.execute({
        name,
        marketplace,
        external_id,
        email,
        link,
        website,
        url,
        address,
        city,
        state,
        country,
        zip_code,
        status,
        is_active,
      });

      return response.status(201).json(supplier);
    } catch (error: unknown) {
      if (error instanceof AppError) {
        return response.status(error.statusCode).json({ error: error.message });
      }
      console.error(error);
      return response.status(500).json({ error: 'Internal server error' });
    }
  }

  // Atualização de supplier
  public async update(request: Request, response: Response): Promise<Response> {
    try {
      const { id } = request.params;
      const {
        name,
        marketplace,
        external_id,
        email,
        link,
        website,
        url,
        address,
        city,
        state,
        country,
        zip_code,
        status,
        is_active,
      } = request.body;

      const updateSupplier = container.resolve(UpdateSupplierService);
      const supplier = await updateSupplier.execute({
        id,
        name,
        marketplace,
        external_id,
        email,
        link,
        website,
        url,
        address,
        city,
        state,
        country,
        zip_code,
        status,
        is_active,
      });

      return response.json(supplier);
    } catch (error: unknown) {
      if (error instanceof AppError) {
        return response.status(error.statusCode).json({ error: error.message });
      }
      console.error(error);
      return response.status(500).json({ error: 'Internal server error' });
    }
  }

  // Remoção de supplier
  public async delete(request: Request, response: Response): Promise<Response> {
    try {
      const { id } = request.params;

      const removeSupplier = container.resolve(RemoveSupplierService);
      await removeSupplier.execute(id);

      return response.status(204).send();
    } catch (error: unknown) {
      if (error instanceof AppError) {
        return response.status(error.statusCode).json({ error: error.message });
      }
      console.error(error);
      return response.status(500).json({ error: 'Internal server error' });
    }
  }
}
