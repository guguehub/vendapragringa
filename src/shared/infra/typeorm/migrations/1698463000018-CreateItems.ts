import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableUnique } from 'typeorm';

export class CreateItems1698463000018 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'items',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'title',
            type: 'varchar',
          },
          {
            name: 'description',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'price',
            type: 'decimal',
            precision: 10,
            scale: 2,
          },
          {
            name: 'external_id',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'marketplace',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'shipping_price',
            type: 'decimal',
            precision: 10,
            scale: 2,
            isNullable: true,
          },
          {
            name: 'status',
            type: 'varchar',
            isNullable: false,
            default: `'ready'`,
          },
          {
            name: 'item_link',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'last_scraped_at',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'images',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'import_stage',
            type: 'varchar',
            isNullable: false,
            default: `'draft'`,
          },
          {
            name: 'is_draft',
            type: 'boolean',
            isNullable: false,
            default: false,
          },
          {
            name: 'is_synced',
            type: 'boolean',
            isNullable: false,
            default: false,
          },
          {
            name: 'supplier_id',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'created_by',
            type: 'varchar',
            isNullable: false,
            default: `'system'`,
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

    // Foreign Key para supplier_id
    await queryRunner.createForeignKey(
      'items',
      new TableForeignKey({
        name: 'FKItemsSupplier',
        columnNames: ['supplier_id'],
        referencedTableName: 'suppliers',
        referencedColumnNames: ['id'],
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      }),
    );

    // Unique constraint: external_id + marketplace
    await queryRunner.createUniqueConstraint(
      'items',
      new TableUnique({
        name: 'UQ_items_external_marketplace',
        columnNames: ['external_id', 'marketplace'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
  await queryRunner.dropUniqueConstraint('items', 'UQ_items_external_marketplace');

  const table = await queryRunner.getTable('items');
  if (table) {
    const foreignKey = table.foreignKeys.find(fk => fk.name === 'FKItemsSupplier');
    if (foreignKey) {
      await queryRunner.dropForeignKey('items', foreignKey);
    }
  }

  await queryRunner.dropTable('items');
  }
}
