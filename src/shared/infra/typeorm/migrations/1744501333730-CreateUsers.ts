import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUsers1744501333730 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE users (
                id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
            );
        `);

    // Adicionar índices para melhorar a performance
    await queryRunner.query(`
            CREATE INDEX idx_users_email ON users(email);
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP INDEX idx_users_email;
        `);

    await queryRunner.query(`
            DROP TABLE users;
        `);
  }
}
