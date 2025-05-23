import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableIndex,
} from 'typeorm';

export class Subscriptions1744865128156 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create the subscriptions table
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
            type: 'enum',
            enum: ['active', 'cancelled', 'expired'],
            default: "'active'",
          },
          {
            name: 'tier',
            type: 'enum',
            enum: ['free', 'bronze', 'silver', 'gold'],
            default: "'free'",
          },
          {
            name: 'startDate',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'endDate',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'expiresAt',
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
            name: 'createdAt',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            default: 'now()',
          },
        ],
      }),
      true,
    );

    // Create index on userId
    await queryRunner.createIndex(
      'subscriptions',
      new TableIndex({
        name: 'IDX_SUBSCRIPTIONS_USERID',
        columnNames: ['userId'],
      }),
    );

    // Create foreign key constraint for userId referencing users(id)
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
    // Drop foreign key first
    const table = await queryRunner.getTable('subscriptions');

    if (!table) {
      throw new Error('Table "subscriptions" not found');
    }

    const foreignKey = table.foreignKeys.find(
      fk => fk.columnNames.indexOf('userId') !== -1,
    );
    if (foreignKey) {
      await queryRunner.dropForeignKey('subscriptions', foreignKey);
    }

    // Drop index on userId
    await queryRunner.dropIndex('subscriptions', 'IDX_SUBSCRIPTIONS_USERID');

    // Drop the subscriptions table
    await queryRunner.dropTable('subscriptions');
  }
}
