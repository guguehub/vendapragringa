import {MigrationInterface, QueryRunner, Table, TableForeignKey} from "typeorm";

export class CreateSavedItemsTable1745380787017  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
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

    // Cria relationship FK para user_id
    await queryRunner.createForeignKey(
      'saved_items',
      new TableForeignKey({
        columnNames: ['user_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'CASCADE',
      }),
    );

    // Cria relationship FK para item_id
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
    // Drop tabelas e chaves
    await queryRunner.dropTable('saved_items');
  }
}
