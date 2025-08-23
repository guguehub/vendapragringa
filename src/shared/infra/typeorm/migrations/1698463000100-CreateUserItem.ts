import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateUserItems1698463000100 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Garante a extensão para UUIDs
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

    // Cria a tabela user_items
    await queryRunner.createTable(
      new Table({
        name: 'user_items',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'user_id',
            type: 'uuid',
          },
          {
            name: 'item_id',
            type: 'uuid',
          },
          {
            name: 'quantity',          // nova coluna
            type: 'int',
            default: 1,
            isNullable: false,
          },
          {
            name: 'import_stage',
            type: 'varchar',
            default: `'draft'`,
          },
          {
            name: 'sync_status',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'notes',
            type: 'text',
            isNullable: true,
          },
          // Campos financeiros opcionais
          {
            name: 'ebay_fee_percent',
            type: 'decimal',
            precision: 5,
            scale: 2,
            isNullable: true,
          },
          {
            name: 'use_custom_fee_percent',
            type: 'boolean',
            isNullable: true,
          },
          {
            name: 'custom_fee_percent',
            type: 'decimal',
            precision: 5,
            scale: 2,
            isNullable: true,
          },
          {
            name: 'ebay_fees_usd',
            type: 'decimal',
            precision: 10,
            scale: 2,
            isNullable: true,
          },
          {
            name: 'sale_value_usd',
            type: 'decimal',
            precision: 10,
            scale: 2,
            isNullable: true,
          },
          {
            name: 'exchange_rate',
            type: 'decimal',
            precision: 10,
            scale: 2,
            isNullable: true,
          },
          {
            name: 'received_brl',
            type: 'decimal',
            precision: 10,
            scale: 2,
            isNullable: true,
          },
          {
            name: 'item_profit_brl',
            type: 'decimal',
            precision: 10,
            scale: 2,
            isNullable: true,
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

    // FK para users
    await queryRunner.createForeignKey(
      'user_items',
      new TableForeignKey({
        columnNames: ['user_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'CASCADE',
      }),
    );

    // FK para items
    await queryRunner.createForeignKey(
      'user_items',
      new TableForeignKey({
        columnNames: ['item_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'items',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop FKs primeiro
    const table = await queryRunner.getTable('user_items');
    if (table) {
      const foreignKeys = table.foreignKeys.filter(
        fk => fk.columnNames.includes('user_id') || fk.columnNames.includes('item_id'),
      );
      for (const fk of foreignKeys) {
        await queryRunner.dropForeignKey('user_items', fk);
      }
    }

    // Drop tabela
    await queryRunner.dropTable('user_items');
  }
}
