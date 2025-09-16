import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateSuppliers1698463000010 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'suppliers',
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
            isNullable: false,
          },
          {
            name: 'url',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'status',
            type: 'enum',
            enum: ['active', 'inactive', 'coming_soon'], // Deve estar alinhado com SupplierStatus enum
            default: `'active'`,
          },
          {
            name: 'is_active',
            type: 'boolean',
            default: true,
          },
          {
            name: 'marketplace',
            type: 'enum',
            enum: ['mercado_livre', 'olx', 'custom'], // Deve estar alinhado com IMarketplaces enum
            isNullable: true,
          },
          {
            name: 'external_id',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'email',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'link',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'website',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'address',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'city',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'state',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'country',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'zip_code',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'user_id',
            type: 'uuid',
            isNullable: true,
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
      true
    );

    await queryRunner.createForeignKey(
      'suppliers',
      new TableForeignKey({
        name: 'FKSuppliersUser',
        columnNames: ['user_id'],
        referencedTableName: 'users',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('suppliers', 'FKSuppliersUser');
    await queryRunner.dropTable('suppliers');
  }
}
