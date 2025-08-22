import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableUnique } from 'typeorm';

export class CreateSavedItems1745380787017 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

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
          { name: 'user_id', type: 'uuid' },
          { name: 'item_id', type: 'uuid' },
          { name: 'created_at', type: 'timestamp', default: 'now()' },
          { name: 'updated_at', type: 'timestamp', default: 'now()' },
        ],
      }),
      true,
    );

    // Constraint de unicidade
    await queryRunner.createUniqueConstraint(
      'saved_items',
      new TableUnique({
        name: 'UQ_saved_items_user_item',
        columnNames: ['user_id', 'item_id'],
      }),
    );

    // FK user_id
    await queryRunner.createForeignKey(
      'saved_items',
      new TableForeignKey({
        columnNames: ['user_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'CASCADE',
      }),
    );

    // FK item_id
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
    const table = await queryRunner.getTable('saved_items');
    if (table) {
      const fkUser = table.foreignKeys.find(fk => fk.columnNames.includes('user_id'));
      const fkItem = table.foreignKeys.find(fk => fk.columnNames.includes('item_id'));

      if (fkUser) await queryRunner.dropForeignKey('saved_items', fkUser);
      if (fkItem) await queryRunner.dropForeignKey('saved_items', fkItem);
    }

    const uniqueConstraint = table?.uniques.find(uq => uq.name === 'UQ_saved_items_user_item');
    if (uniqueConstraint) {
      await queryRunner.dropUniqueConstraint('saved_items', uniqueConstraint);
    }

    await queryRunner.dropTable('saved_items');
  }
}
