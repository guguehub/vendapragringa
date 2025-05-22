import seedShippingTypes from './seedShippingTypes';
import seedShippingZones from './seedShippingZones';
import seedShippingWeights from './seedShippingWeights';
import seedShippingPrices from './seedShippingPrices'; // 👈 NOVO

async function runAllSeeders() {
  await seedShippingTypes();
  await seedShippingZones();
  await seedShippingWeights();
  await seedShippingPrices(); // 👈 NOVO
}

runAllSeeders()
  .then(() => {
    console.log('[Seed] Finalizado com sucesso.');
    process.exit(0);
  })
  .catch(error => {
    console.error('[Seed] Erro:', error);
    process.exit(1);
  });
