import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from 'typeorm';

export class CreateUserItem1698463000100 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Cria a tabela user_items
    await queryRunner.createTable(
      new Table({
        name: 'user_items',
        columns: [
          { name: 'id', type: 'uuid', isPrimary: true, generationStrategy: 'uuid', default: 'uuid_generate_v4()' },
          { name: 'user_id', type: 'uuid', isNullable: false },
          { name: 'item_id', type: 'uuid', isNullable: false },
          { name: 'quantity', type: 'int', isNullable: false, default: 1 },

          // Snapshot do item
          { name: 'snapshot_title', type: 'varchar', isNullable: true },
          { name: 'snapshot_price', type: 'decimal', precision: 10, scale: 2, isNullable: true },
          { name: 'snapshot_images', type: 'jsonb', isNullable: true },
          { name: 'snapshot_marketplace', type: 'varchar', isNullable: true },
          { name: 'snapshot_external_id', type: 'varchar', isNullable: true },

          // eBay Specific
          { name: 'ebay_title', type: 'varchar', isNullable: true },
          { name: 'ebay_link', type: 'varchar', isNullable: true },
          { name: 'ebay_price', type: 'decimal', precision: 10, scale: 2, isNullable: true },
          { name: 'ebay_shipping_weight_grams', type: 'int', isNullable: true },
          { name: 'is_listed_on_ebay', type: 'boolean', isNullable: false, default: false },
          { name: 'is_offer_enabled', type: 'boolean', isNullable: false, default: false },
          { name: 'is_campaign_enabled', type: 'boolean', isNullable: false, default: false },

          // Finance Custom
          { name: 'ebay_fee_percent', type: 'decimal', precision: 5, scale: 2, isNullable: true },
          { name: 'use_custom_fee_percent', type: 'boolean', isNullable: false, default: false },
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

    // Cria as foreign keys
    await queryRunner.createForeignKeys('user_items', [
      new TableForeignKey({
        name: 'FKUserItemsUser',
        columnNames: ['user_id'],
        referencedTableName: 'users',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
      new TableForeignKey({
        name: 'FKUserItemsItem',
        columnNames: ['item_id'],
        referencedTableName: 'items',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    ]);

    // Índice único para garantir que o mesmo usuário não duplique o mesmo item
    await queryRunner.createIndex(
      'user_items',
      new TableIndex({
        name: 'IDX_USER_ITEM_UNIQUE',
        columnNames: ['user_id', 'item_id'],
        isUnique: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remove índice
    await queryRunner.dropIndex('user_items', 'IDX_USER_ITEM_UNIQUE');

    // Remove foreign keys
    const table = await queryRunner.getTable('user_items');
    if (table) {
      const fkUser = table.foreignKeys.find(fk => fk.name === 'FKUserItemsUser');
      if (fkUser) await queryRunner.dropForeignKey('user_items', fkUser);

      const fkItem = table.foreignKeys.find(fk => fk.name === 'FKUserItemsItem');
      if (fkItem) await queryRunner.dropForeignKey('user_items', fkItem);
    }

    // Remove tabela
    await queryRunner.dropTable('user_items');
  }
}
