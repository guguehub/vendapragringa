import dataSource from "@shared/infra/typeorm/data-source"
import seedShippingTypes from './seedShippingTypes';
import seedShippingWeights from './seedShippingWeights';
import seedShippingZones from './seedShippingZones';
import seedShippingZoneCountries from './seedShippingZoneCountries';
import seedShippingPricesProducts from './seedShippingPricesProducts';

async function runSeeds() {
  try {
    await dataSource.initialize();
    console.log('DATABASE ENV: rodando seeds');

    // Ordem correta:
    await seedShippingTypes(dataSource);
    await seedShippingWeights(dataSource);
    await seedShippingZones(dataSource);
    await seedShippingZoneCountries(dataSource);
    await seedShippingPricesProducts(dataSource);

    console.log('✅ Todas as seeds de shipping rodaram com sucesso!');
  } catch (error) {
    console.error('❌ Erro ao rodar seeds:', error);
  } finally {
    await dataSource.destroy();
    console.log('Conexão com banco finalizada');
  }
}

runSeeds();
