//import { AppDataSource } from '@shared/infra/typeorm';
//import Supplier from '../entities/Supplier';
import dataSource from '@shared/infra/typeorm/data-source';
import Supplier from '@modules/suppliers/infra/typeorm/entities/Supplier';

async function createDefaultSuppliers() {
  const connection = await dataSource.initialize();
  const supplierRepository = connection.getRepository(Supplier);

  const knownSuppliers = ['mercado_livre', 'olx', 'custom'];

  for (const name of knownSuppliers) {
    const exists = await supplierRepository.findOneBy({ name });

    if (!exists) {
      const supplier = supplierRepository.create({ name });
      await supplierRepository.save(supplier);
      console.log(`Created supplier: ${name}`);
    }
  }

  await connection.destroy();
}

createDefaultSuppliers().catch(console.error);
