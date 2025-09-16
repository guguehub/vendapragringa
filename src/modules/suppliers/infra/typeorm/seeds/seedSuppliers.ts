// src/modules/suppliers/infra/typeorm/seeds/seedSuppliers.ts
import { DataSource, DeepPartial } from 'typeorm';
import Supplier from '../entities/Supplier';
import dataSource from '@shared/infra/typeorm/data-source';
import { SupplierStatus } from '@modules/suppliers/domain/enums/supplier-status.enum';

const suppliersSeed: DeepPartial<Supplier>[] = [
  {
    name: 'Mercado Livre',
    url: 'https://www.mercadolivre.com.br',
    status: SupplierStatus.ACTIVE,
  },
  {
    name: 'OLX',
    url: 'https://www.olx.com.br',
    status: SupplierStatus.COMING_SOON,
  },
];

export default async function seedSuppliers() {
  console.log('=== Iniciando seed de suppliers ===');

  try {
    console.log('Tentando conectar ao banco...');
    await dataSource.initialize();
    console.log(`Conectado com sucesso ao banco: ${dataSource.options.database}`);

    const repo = dataSource.getRepository(Supplier);

    for (const supplier of suppliersSeed) {
      const exists = await repo.findOne({ where: { name: supplier.name } });
      if (!exists) {
        const newSupplier = repo.create(supplier);
        await repo.save(newSupplier);
        console.log(`✅ Supplier criado: ${supplier.name}`);
      } else {
        console.log(`ℹ️ Supplier já existe: ${supplier.name}`);
      }
    }

    console.log('=== Seed de suppliers finalizada ===');
  } catch (err) {
    console.error('❌ Erro ao rodar seed de suppliers:', err);
  } finally {
    await dataSource.destroy();
    console.log('Conexão com o banco encerrada');
  }
}

// Se rodar diretamente com ts-node-dev
if (require.main === module) {
  seedSuppliers();
}
