import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateUserItem1698463000100 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
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
            isNullable: false,
          },
          {
            name: 'item_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'quantity',
            type: 'int',
            default: 1,
          },
          // eBay Specific
          { name: 'ebay_title', type: 'varchar', isNullable: true },
          { name: 'ebay_link', type: 'varchar', isNullable: true },
          { name: 'ebay_price', type: 'decimal', precision: 10, scale: 2, isNullable: true },
          { name: 'ebay_shipping_weight_grams', type: 'int', isNullable: true },
          { name: 'is_listed_on_ebay', type: 'boolean', isNullable: true },
          { name: 'is_offer_enabled', type: 'boolean', isNullable: true },
          { name: 'is_campaign_enabled', type: 'boolean', isNullable: true },
          // Finance Custom
          { name: 'ebay_fee_percent', type: 'decimal', precision: 5, scale: 2, isNullable: true },
          { name: 'use_custom_fee_percent', type: 'boolean', isNullable: true },
          { name: 'custom_fee_percent', type: 'decimal', precision: 5, scale: 2, isNullable: true },
          { name: 'ebay_fees_usd', type: 'decimal', precision: 10, scale: 2, isNullable: true },
          { name: 'sale_value_usd', type: 'decimal', precision: 10, scale: 2, isNullable: true },
          { name: 'exchange_rate', type: 'decimal', precision: 10, scale: 2, isNullable: true },
          { name: 'received_brl', type: 'decimal', precision: 10, scale: 2, isNullable: true },
          { name: 'item_profit_brl', type: 'decimal', precision: 10, scale: 2, isNullable: true },
          // Controle
          { name: 'sync_status', type: 'varchar', isNullable: true },
          { name: 'notes', type: 'text', isNullable: true },
          { name: 'import_stage', type: 'varchar', isNullable: false, default: `'draft'` },
          // Metadata
          { name: 'created_at', type: 'timestamp', default: 'now()' },
          { name: 'updated_at', type: 'timestamp', default: 'now()' },
        ],
      }),
      true,
    );

    // Criação das foreign keys
    await queryRunner.createForeignKeys('user_items', [
      new TableForeignKey({
        columnNames: ['user_id'],
        referencedTableName: 'users',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
      new TableForeignKey({
        columnNames: ['item_id'],
        referencedTableName: 'items',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('user_items');
  }
}
