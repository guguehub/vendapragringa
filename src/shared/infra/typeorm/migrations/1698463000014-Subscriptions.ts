import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableIndex,
} from 'typeorm';

export class Subscriptions1698463000014 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Cria enums
    await queryRunner.query(
      `CREATE TYPE "subscriptions_status_enum" AS ENUM ('active', 'cancelled', 'expired')`,
    );

    await queryRunner.query(
      `CREATE TYPE "subscriptions_tier_enum" AS ENUM ('free', 'bronze', 'silver', 'gold', 'infinity')`,
    );

    // Cria tabela subscriptions
    await queryRunner.createTable(
      new Table({
        name: 'subscriptions',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'uuid',
          },
          {
            name: 'status',
            type: `"subscriptions_status_enum"`,
            default: "'active'",
          },
          {
            name: 'tier',
            type: `"subscriptions_tier_enum"`,
            default: "'free'",
          },
          {
            name: 'start_date',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'expires_at',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'isTrial',
            type: 'boolean',
            default: false,
          },
          {
            name: 'cancelled_at',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'userId',
            type: 'uuid',
            isNullable: false,
            isUnique: true,
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

    // Index em userId
    await queryRunner.createIndex(
      'subscriptions',
      new TableIndex({
        name: 'IDX_SUBSCRIPTIONS_USERID',
        columnNames: ['userId'],
      }),
    );

    // Index em tier (útil para queries por plano)
    await queryRunner.createIndex(
      'subscriptions',
      new TableIndex({
        name: 'IDX_SUBSCRIPTIONS_TIER',
        columnNames: ['tier'],
      }),
    );

    // FK para users.id
    await queryRunner.createForeignKey(
      'subscriptions',
      new TableForeignKey({
        columnNames: ['userId'],
        referencedTableName: 'users',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('subscriptions');

    if (!table) {
      throw new Error('Table "subscriptions" not found');
    }

    // Drop FK
    const foreignKey = table.foreignKeys.find(fk =>
      fk.columnNames.includes('userId'),
    );
    if (foreignKey) {
      await queryRunner.dropForeignKey('subscriptions', foreignKey);
    }

    // Drop indexes
    await queryRunner.dropIndex('subscriptions', 'IDX_SUBSCRIPTIONS_USERID');
    await queryRunner.dropIndex('subscriptions', 'IDX_SUBSCRIPTIONS_TIER');

    // Drop tabela
    await queryRunner.dropTable('subscriptions');

    // Drop enums
    await queryRunner.query(`DROP TYPE "subscriptions_status_enum"`);
    await queryRunner.query(`DROP TYPE "subscriptions_tier_enum"`);
  }
}
