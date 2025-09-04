import 'dotenv/config';

import dataSource from '../../../../../shared/infra/typeorm/data-source';

import seedShippingTypes from './seedShippingTypes';
import seedShippingWeights from './seedShippingWeights';
import seedShippingZones from './seedShippingZones';
import seedShippingZoneCountries from './seedShippingZoneCountries';
import seedShippingPricesProducts from './seedShippingPricesProducts';

async function runSeeds() {
  try {
    await dataSource.initialize();
    console.log('✅ Banco inicializado');

    console.log('🚚 [1/5] Rodando seedShippingTypes...');
    await seedShippingTypes(dataSource);

    console.log('⚖️ [2/5] Rodando seedShippingWeights...');
    await seedShippingWeights(dataSource);

    console.log('🌍 [3/5] Rodando seedShippingZones...');
    await seedShippingZones(dataSource);

    console.log('🏳️ [4/5] Rodando seedShippingZoneCountries...');
    await seedShippingZoneCountries(dataSource);

    console.log('💰 [5/5] Rodando seedShippingPricesProducts...');
    await seedShippingPricesProducts(dataSource);

    console.log('🎉 Todas as seeds foram rodadas com sucesso!');
  } catch (error) {
    console.error('❌ Erro ao rodar seeds:', error);
  } finally {
    await dataSource.destroy();
    console.log('🔌 Conexão com banco finalizada');
  }
}

console.log('DATABASE ENV:', 'rodando seeds...');
runSeeds();
