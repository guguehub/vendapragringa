import 'dotenv/config';

import dataSource from '../../../../../shared/infra/typeorm/data-source';
import seedShippingPricesProducts from './seedShippingPricesProducts';
import seedShippingTypes from './seedShippingTypes';
import seedShippingWeights from './seedShippingWeights';


async function runSeeds() {
  try {
    await dataSource.initialize();
    console.log('Banco inicializado');

    await seedShippingTypes(dataSource); // passe dataSource aqui também se necessário
    await seedShippingWeights(dataSource); // idem
    await seedShippingPricesProducts(dataSource); // corrige erro de argumentos

    console.log('Seeds rodadas com sucesso!');
  } catch (error) {
    console.error('Erro ao rodar seeds:', error);
  } finally {
    await dataSource.destroy();
    console.log('Conexão com banco finalizada');
  }
}
console.log('DATABASE ENV:',   "rodando seeds");
runSeeds();
