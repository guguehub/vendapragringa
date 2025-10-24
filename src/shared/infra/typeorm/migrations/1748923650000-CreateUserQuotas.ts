import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateUserQuotas1748923650000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Criação da tabela
    await queryRunner.createTable(
      new Table({
        name: 'user_quotas',
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
            name: 'scrape_count',
            type: 'int',
            default: 0,
          },
          {
            name: 'scrape_balance',
            type: 'int',
            default: 0,
          },
          {
            name: 'item_limit',
            type: 'int',
            default: 0,
          },
          {
            name: 'daily_bonus_count',
            type: 'int',
            default: 0,
          },
          {
            name: 'saved_items_limit',
            type: 'int',
            default: 100,
          },
          {
            name: 'scrape_logs_limit',
            type: 'int',
            default: 200,
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
    );

    // Criação da foreign key para user
    await queryRunner.createForeignKey(
      'user_quotas',
      new TableForeignKey({
        name: 'UserQuotaUser',
        columnNames: ['user_id'],
        referencedTableName: 'users',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remoção da foreign key
    await queryRunner.dropForeignKey('user_quotas', 'UserQuotaUser');

    // Remoção da tabela
    await queryRunner.dropTable('user_quotas');
  }
}
