import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateUserAddresses1698463000005 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

    await queryRunner.createTable(
      new Table({
        name: 'user_addresses',
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
          { name: 'street', type: 'varchar' },
          { name: 'number', type: 'varchar', isNullable: true },
          { name: 'complement', type: 'varchar', isNullable: true },
          { name: 'district', type: 'varchar', isNullable: true },
          { name: 'city', type: 'varchar' },
          { name: 'state', type: 'varchar' },
          { name: 'zip_code', type: 'varchar' },
          { name: 'country', type: 'varchar' },

          // 🔹 Telefone segmentado
          { name: 'country_code', type: 'varchar', length: '4', isNullable: true },
          { name: 'area_code', type: 'varchar', length: '4', isNullable: true },
          { name: 'phone_number', type: 'varchar', length: '15', isNullable: true },

          { name: 'created_at', type: 'timestamp with time zone', default: 'now()' },
          { name: 'updated_at', type: 'timestamp with time zone', default: 'now()' },
        ],
      }),
    );

    // 🔹 Foreign key com user
    await queryRunner.createForeignKey(
      'user_addresses',
      new TableForeignKey({
        columnNames: ['user_id'],
        referencedTableName: 'users',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('user_addresses');
    const foreignKey = table!.foreignKeys.find(fk => fk.columnNames.indexOf('user_id') !== -1);
    if (foreignKey) {
      await queryRunner.dropForeignKey('user_addresses', foreignKey);
    }
    await queryRunner.dropTable('user_addresses');
  }
}
