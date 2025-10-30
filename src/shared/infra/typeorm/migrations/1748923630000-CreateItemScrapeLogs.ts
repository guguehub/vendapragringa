import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateItemScrapeLogs1748923630000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'item_scrape_logs',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'item_id',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'user_id',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'ip_address',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'listed_on_ebay',
            type: 'boolean',
            default: false,
          },
          {
            name: 'action',
            type: 'varchar',
            isNullable: true,
            comment: 'Tipo da ação (ex: SCRAPE_USED, DAILY_BONUS_RESET)',
          },
          {
            name: 'details',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'timestamp',
            type: 'timestamp',
            default: 'now()',
            comment: 'Data/hora da ação de scrape',
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
            comment: 'Data/hora de criação do registro',
          },
        ],
        foreignKeys: [
          {
            name: 'FKItemScrapeLogItem',
            columnNames: ['item_id'],
            referencedTableName: 'items',
            referencedColumnNames: ['id'],
            onDelete: 'SET NULL',
            onUpdate: 'CASCADE',
          },
          {
            name: 'FKItemScrapeLogUser',
            columnNames: ['user_id'],
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            onDelete: 'SET NULL',
            onUpdate: 'CASCADE',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('item_scrape_logs');
  }
}
