import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateSavedItemsTable1745380787017 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Garante que a extensão para UUIDs exista
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

    // Cria a tabela saved_items
    await queryRunner.createTable(
      new Table({
        name: 'saved_items',
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

    // FK para user_id
    await queryRunner.createForeignKey(
      'saved_items',
      new TableForeignKey({
        columnNames: ['user_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'CASCADE',
      }),
    );

    // FK para item_id
    await queryRunner.createForeignKey(
      'saved_items',
      new TableForeignKey({
        columnNames: ['item_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'items',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remove FKs antes de dropar a tabela
    const table = await queryRunner.getTable('saved_items');
    if (table) {
      const foreignKeys = table.foreignKeys.filter(
        fk => fk.columnNames.includes('user_id') || fk.columnNames.includes('item_id'),
      );
      for (const fk of foreignKeys) {
        await queryRunner.dropForeignKey('saved_items', fk);
      }
    }

    // Drop tabela
    await queryRunner.dropTable('saved_items');
  }
}
