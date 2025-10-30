import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableIndex,
} from 'typeorm';

export class Subscriptions1698463000014 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // --- Criação dos ENUMs ---
    await queryRunner.query(`
      CREATE TYPE "subscriptions_status_enum" AS ENUM ('active', 'cancelled', 'expired')
    `);

    await queryRunner.query(`
      CREATE TYPE "subscriptions_tier_enum" AS ENUM ('free', 'bronze', 'silver', 'gold', 'infinity')
    `);

    // --- Criação da Tabela ---
    await queryRunner.createTable(
      new Table({
        name: 'subscriptions',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            isGenerated: true,
          },
          {
            name: 'status',
            type: '"subscriptions_status_enum"',
            default: `'active'`,
          },
          {
            name: 'tier',
            type: '"subscriptions_tier_enum"',
            default: `'free'`,
          },
          {
            name: 'scrape_balance',
            type: 'integer',
            default: 0,
            comment:
              'Saldo de raspagens do plano atual; atualizado ao fazer upgrade/downgrade ou renovar',
          },
          {
              name: 'total_scrapes_used',
              type: 'integer',
              default: 0,
              comment: 'Total de raspagens já utilizadas (histórico cumulativo)',
},
          {
            name: 'start_date',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'expires_at',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'isTrial',
            type: 'boolean',
            default: false,
          },
          {
            name: 'cancelled_at',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'userId',
            type: 'uuid',
            isNullable: false,
            isUnique: true,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'now()',
          },
        ],
      }),
      true,
    );

    // --- Índices ---
    await queryRunner.createIndex(
      'subscriptions',
      new TableIndex({
        name: 'IDX_SUBSCRIPTIONS_USERID',
        columnNames: ['userId'],
      }),
    );

    await queryRunner.createIndex(
      'subscriptions',
      new TableIndex({
        name: 'IDX_SUBSCRIPTIONS_TIER',
        columnNames: ['tier'],
      }),
    );

    // --- Chave estrangeira ---
    await queryRunner.createForeignKey(
      'subscriptions',
      new TableForeignKey({
        columnNames: ['userId'],
        referencedTableName: 'users',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('subscriptions');
    if (!table) return;

    // --- Drop FK ---
    const fk = table.foreignKeys.find(fk =>
      fk.columnNames.includes('userId'),
    );
    if (fk) {
      await queryRunner.dropForeignKey('subscriptions', fk);
    }

    // --- Drop Índices ---
    await queryRunner.dropIndex('subscriptions', 'IDX_SUBSCRIPTIONS_USERID');
    await queryRunner.dropIndex('subscriptions', 'IDX_SUBSCRIPTIONS_TIER');

    // --- Drop da Tabela ---
    await queryRunner.dropTable('subscriptions');

    // --- Drop dos ENUMs ---
    await queryRunner.query(`DROP TYPE "subscriptions_status_enum"`);
    await queryRunner.query(`DROP TYPE "subscriptions_tier_enum"`);
  }
}
