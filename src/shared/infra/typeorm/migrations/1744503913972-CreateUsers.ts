import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateUsers1744503913972 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Ensure the uuid-ossp extension is available for UUID generation
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

    // Create the 'users' table
    await queryRunner.createTable(
      new Table({
        name: 'users',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'name',
            type: 'varchar',
          },
          {
            name: 'email',
            type: 'varchar',
            isUnique: true,
          },
          {
            name: 'password',
            type: 'varchar',
          },
          {
            name: 'avatar',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'created_at',
            type: 'timestamp with time zone',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamp with time zone',
            default: 'now()',
          },
        ],
      }),
      true,
    );

    // Create an index on the 'email' column to improve query performance
    await queryRunner.query(`CREATE INDEX idx_users_email ON users(email)`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop the index on the 'email' column
    await queryRunner.query(`DROP INDEX IF EXISTS idx_users_email`);

    // Drop the 'users' table
    await queryRunner.dropTable('users');
  }
}
