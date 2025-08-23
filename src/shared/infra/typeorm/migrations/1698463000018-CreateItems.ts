import { MigrationInterface, QueryRunner, Table } from 'typeorm';

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
            name: 'user_id',
            type: 'uuid',
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
            name: 'currency',
            type: 'varchar',
            length: '3',
            default: `'USD'`,
          },
          {
            name: 'external_id',
            type: 'varchar',
            isNullable: true, // ID do marketplace (ML, OLX, Shopee etc.)
          },
          {
            name: 'marketplace',
            type: 'varchar',
            isNullable: true, // "mercadolivre" | "olx" | "shopee" ...
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
            default: `'draft'`, // ["ready", "listed", "sold"]
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
            isNullable: true, // JSON string com array de URLs
          },
          {
            name: 'import_stage',
            type: 'varchar',
            default: `'draft'`, // "draft" | "pending" | "ready" | "listed" | "sold"
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
            default: true,
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
            name: 'FKItemsUser',
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            columnNames: ['user_id'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
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
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('items');
  }
}
