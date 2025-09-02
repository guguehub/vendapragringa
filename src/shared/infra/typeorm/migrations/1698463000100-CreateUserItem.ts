import { MigrationInterface, QueryRunner, Table, TableUnique } from 'typeorm';

export class CreateItems1698463000000 implements MigrationInterface {
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
            name: 'item_shipping_cost_brl',
            type: 'decimal',
            precision: 10,
            scale: 2,
            isNullable: true,
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
        foreignKeys: [
          {
            name: 'FKItemsSupplier',
            referencedTableName: 'suppliers',
            referencedColumnNames: ['id'],
            columnNames: ['supplier_id'],
            onDelete: 'SET NULL',
            onUpdate: 'CASCADE',
          },
        ],
      }),
    );

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
    await queryRunner.dropTable('items');
  }
}
