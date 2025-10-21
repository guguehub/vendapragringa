import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateUsers1698463000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

    await queryRunner.createTable(
      new Table({
        name: 'users',
        columns: [
          // 🔹 Identificação
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          { name: 'name', type: 'varchar' },
          { name: 'email', type: 'varchar', isUnique: true },
          { name: 'password', type: 'varchar' },

          // 🔹 Flags e permissões
          { name: 'hasUsedFreeScrap', type: 'boolean', default: false },
          { name: 'is_admin', type: 'boolean', default: false },

          // 🔹 Billing (opcional / futuro)
          { name: 'billing_customer_id', type: 'varchar', isNullable: true },
          { name: 'billing_status', type: 'varchar', isNullable: true },

          // 🔹 Controle de quotas e limites
          { name: 'scrape_count', type: 'integer', default: 0 },
          { name: 'scrape_balance', type: 'integer', default: 0 },
          { name: 'daily_bonus_count', type: 'integer', default: 0 },
          { name: 'item_limit', type: 'integer', default: 0 },

          // 🔹 Data de expiração do plano
          { name: 'plan_expires_at', type: 'timestamptz', isNullable: true },

          // 🔹 Controle de exclusão lógica (soft delete)
          { name: 'deleted_at', type: 'timestamptz', isNullable: true },

          // 🔹 Timestamps
          { name: 'created_at', type: 'timestamptz', default: 'now()' },
          { name: 'updated_at', type: 'timestamptz', default: 'now()' },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('users');
  }
}
