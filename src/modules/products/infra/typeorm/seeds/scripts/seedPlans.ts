import 'reflect-metadata';
import seedProducts from '@modules/products/infra/typeorm/seeds/seedProducts';

async function run() {
  console.log('🔹 Iniciando seed de planos...');
  try {
    await seedProducts();
    console.log('🎉 Seed de planos concluída com sucesso!');
  } catch (err) {
    console.error('❌ Erro na seed de planos:', err);
  }
}

run();
