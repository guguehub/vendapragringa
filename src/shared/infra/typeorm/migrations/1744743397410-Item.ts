import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class Item1744743397410 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create the items table
    await queryRunner.createTable(
      new Table({
        name: 'items',
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
            name: 'price',
            type: 'decimal',
            precision: 10,
            scale: 2,
            isNullable: false,
          },
          {
            name: 'description',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'marketplace',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'external_id',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'shipping_price',
            type: 'decimal',
            precision: 10,
            scale: 2,
            isNullable: true,
          },
          {
            name: 'status',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'is_listed_on_ebay',
            type: 'boolean',
            isNullable: true,
          },
          {
            name: 'supplierId',
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
      true,
    );

    // Create foreign key for supplierId
    await queryRunner.createForeignKey(
      'items',
      new TableForeignKey({
        columnNames: ['supplierId'],
        referencedTableName: 'suppliers',
        referencedColumnNames: ['id'],
        onDelete: 'SET NULL',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop the items table
    await queryRunner.dropTable('items');
  }
}
